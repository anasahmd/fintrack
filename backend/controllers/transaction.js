const mongoose = require('mongoose');
const Transaction = require('../models/transaction');
const Category = require('../models/category');
const Account = require('../models/account');
const { transactionSchema } = require('../validations/transaction');

//!!! Add pagination
const getAllTransaction = async (request, response) => {
	const transactions = await Transaction.find({ user: request.user._id })
		.populate('category', 'name emoji')
		.populate('account', 'name type')
		.sort({ date: -1 });
	return response.status(200).json(transactions);
};

const getTransaction = async (request, response) => {
	const transaction = await Transaction.findOne({
		_id: request.params.id,
		user: request.user._id,
	})
		.populate('category', 'name emoji color')
		.populate('account', 'name type isActive');

	if (!transaction) {
		return response.status(404).json({ error: 'Transaction not found' });
	}

	return response.status(200).json(transaction);
};

const postTransaction = async (request, response) => {
	try {
		await transactionSchema.validateAsync(request.body);
	} catch (e) {
		return response.status(400).json({ error: e.details[0].message });
	}

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const {
			title,
			amount,
			type,
			category,
			account,
			currency,
			tags,
			date,
			description,
		} = request.body;

		const targetAccount = await Account.findOne({
			_id: account,
			user: request.user._id,
			isActive: true,
		}).session(session);

		if (!targetAccount) {
			await session.abortTransaction();
			return response
				.status(404)
				.json({ error: 'Account not found or inactive' });
		}

		const [savedTransaction] = await Transaction.create(
			[
				{
					...request.body,
					user: request.user._id,
				},
			],
			{ session },
		);

		if (type === 'Expense') {
			targetAccount.balance -= amount;
		} else if (type === 'Income') {
			targetAccount.balance += amount;
		}

		await targetAccount.save({ session });

		await session.commitTransaction();

		await savedTransaction.populate('category', 'name emoji color');
		await savedTransaction.populate('account', 'name type');

		return response.status(201).json(savedTransaction);
	} catch (e) {
		await session.abortTransaction();
		console.log(e);

		return response
			.status(400)
			.json({ error: 'Failed to process transaction' });
	} finally {
		session.endSession();
	}
};

const updateTransaction = async (request, response) => {
	try {
		await transactionSchema.validateAsync(request.body);
	} catch (e) {
		return response.status(400).json({ error: e.details[0].message });
	}

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const originalTx = await Transaction.findOne({
			_id: request.params.id,
			user: request.user._id,
		}).session(session);

		if (!originalTx) {
			await session.abortTransaction();
			return response.status(404).json({ error: 'Transaction not found' });
		}

		const category = await Category.findById(request.body.category).session(
			session,
		);
		if (!category || category.type !== request.body.type) {
			await session.abortTransaction();
			return response
				.status(400)
				.json({ error: 'Invalid Category or Type mismatch' });
		}

		// It handles user changing the account while updating
		const oldAccount = await Account.findById(originalTx.account).session(
			session,
		);

		const isChangingAccount =
			originalTx.account.toString() !== request.body.account;

		const newAccount = isChangingAccount
			? await Account.findById(request.body.account).session(session)
			: oldAccount;

		if (!oldAccount || !newAccount) {
			await session.abortTransaction();
			return response.status(404).json({ error: 'Account not found' });
		}

		// Reverses the old transaction amount
		if (originalTx.type === 'Expense') {
			oldAccount.balance += originalTx.amount;
		} else if (originalTx.type === 'Income') {
			oldAccount.balance -= originalTx.amount;
		}

		// Adds the new transaction amount
		if (request.body.type === 'Expense') {
			newAccount.balance -= request.body.amount;
		} else if (request.body.type === 'Income') {
			newAccount.balance += request.body.amount;
		}

		await oldAccount.save({ session });
		if (isChangingAccount) {
			await newAccount.save({ session });
		}

		originalTx.set(request.body);
		await originalTx.save({ session });

		await session.commitTransaction();

		await originalTx.populate('category', 'name emoji color');
		await originalTx.populate('account', 'name type');

		return response.status(200).json(originalTx);
	} catch (error) {
		await session.abortTransaction();
		return response.status(400).json({ error: 'Failed to update transaction' });
	} finally {
		session.endSession();
	}
};

const deleteTransaction = async (request, response) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const transaction = await Transaction.findOne({
			_id: request.params.id,
			user: request.user._id,
		}).session(session);

		if (!transaction) {
			await session.abortTransaction();
			return response.status(404).json({ error: 'Transaction not found' });
		}

		const account = await Account.findById(transaction.account).session(
			session,
		);

		if (!account) {
			await session.abortTransaction();
			return response
				.status(404)
				.json({ error: 'Associated account not found' });
		}

		if (transaction.type === 'Expense') {
			account.balance += transaction.amount;
		} else if (transaction.type === 'Income') {
			account.balance -= transaction.amount;
		}

		await account.save({ session });
		await transaction.deleteOne({ session });

		await session.commitTransaction();

		return response.status(204).end();
	} catch (error) {
		await session.abortTransaction();
		return response.status(400).json({ error: 'Failed to delete transaction' });
	} finally {
		session.endSession();
	}
};

const getAllTags = async (request, response) => {
	const tags = await Transaction.distinct('tags', { user: request.user._id });

	tags.sort((a, b) => a.localeCompare(b));

	return response.status(200).json(tags);
};

module.exports = {
	getAllTransaction,
	getTransaction,
	postTransaction,
	updateTransaction,
	deleteTransaction,
	getAllTags,
};
