const transactionRouter = require('express').Router();
const Transaction = require('../models/transaction');
const Category = require('../models/category');
const Account = require('../models/account');

const {
	transactionSchema,
	updateTransactionSchema,
} = require('../validations/transaction');

//!!! Add pagination
const getAllTransaction = async (request, response) => {
	const transactions = await Transaction.find({ user: request.user.id })
		.populate('category', 'name emoji')
		.populate('account', 'name type')
		.sort({ date: -1 });
	return response.status(200).json(transactions);
};

const getTransaction = async (request, response) => {
	const transaction = await Transaction.findOne({
		_id: request.params.id,
		user: request.user.id,
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
			user: request.user.id,
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
					user: request.user.id,
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

		return response
			.status(400)
			.json({ error: 'Failed to process transaction' });
	} finally {
		session.endSession();
	}
};

const updateTransaction = async (request, response, next) => {
	const transaction = await Transaction.findById(request.params.id);

	if (!transaction) {
		return response.status(404).json({ error: 'Transaction not found' });
	}

	if (request.user.id.toString() !== transaction.user.toString()) {
		return response.status(403).json({ error: 'User not authorized' });
	}

	try {
		await transactionSchema.validateAsync(request.body);
	} catch (e) {
		return response.status(400).json({ error: e.details[0].message });
	}

	const category = await Category.findById(request.body.category);

	if (!category) {
		return response.status(400).json({ error: 'Category not found' });
	}

	if (category.type !== request.body.type) {
		return response.status(400).json({
			error: `Type mismatch: You cannot assign a ${category.type} category to an ${request.body.type} transaction.`,
		});
	}

	const updatedTransaction = await Transaction.findByIdAndUpdate(
		transaction.id,
		request.body,
		{ new: true, runValidators: true, context: 'query' },
	).populate('category', 'name emoji');

	return response.status(200).json(updatedTransaction);
};

const deleteTransaction = async (request, response, next) => {
	const transaction = await Transaction.findById(request.params.id);

	if (!transaction) {
		return response.status(404).json({ error: 'Transaction not found' });
	}

	if (transaction.user.toString() !== request.user.id.toString()) {
		return response.status(403).json({ error: 'User not authorized' });
	}

	await transaction.deleteOne();

	return response.status(204).end();
};

//! Get all tags the user has used
const getAllTags = async (request, response, next) => {
	return response.status(501).json({ error: 'Not Implemented' });
};

module.exports = {
	getAllTransaction,
	getTransaction,
	postTransaction,
	updateTransaction,
	deleteTransaction,
	getAllTags,
};
