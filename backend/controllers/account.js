const { default: mongoose } = require('mongoose');
const Account = require('../models/account');
const { accountSchema } = require('../validations/account');
const Transaction = require('../models/transaction');
const Category = require('../models/category');

const getAllAccount = async (request, response) => {
	try {
		const accounts = await Account.find({
			user: request.user.id,
			isActive: true,
		}).sort({ name: 1 });

		return response.status(200).json(accounts);
	} catch (error) {
		console.error('Error fetching accounts:', error);
		return response.status(500).json({ error: 'Failed to fetch accounts' });
	}
};

const postAccount = async (request, response) => {
	let validatedData;
	try {
		validatedData = await accountSchema.validateAsync(request.body);
	} catch (e) {
		return response.status(400).json({ error: e.details[0].message });
	}

	const initialBalance = Number(request.body.balance) || 0;

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const [account] = await Account.create(
			[{ ...validatedData, user: request.user.id }],
			{ session },
		);

		if (initialBalance !== 0) {
			const transactionType = initialBalance > 0 ? 'Income' : 'Expense';
			const absoluteAmount = Math.abs(initialBalance);

			let systemCategory = await Category.findOne({
				name: 'Starting Balance',
				type: transactionType,
				user: request.user.id,
			}).session(session);

			if (!systemCategory) {
				const [newCategory] = await Category.create(
					[
						{
							name: 'Starting Balance',
							emoji: '🏦',
							color: 'grey',
							type: transactionType,
							user: request.user.id,
						},
					],
					{ session },
				);

				systemCategory = newCategory;
			}

			await Transaction.create(
				[
					{
						user: request.user.id,
						title: 'Initial Funding',
						amount: absoluteAmount,
						account: account._id,
						type: transactionType,
						category: systemCategory._id,
						currency: request.body.currency || 'INR',
						date: new Date().toISOString(),
						tags: ['system', 'adjustment'],
					},
				],
				{ session },
			);
		}

		await session.commitTransaction();
		return response.status(201).json(account);
	} catch (error) {
		await session.abortTransaction();
		console.error('Failed to create account:', error);
		return response.status(500).json({ error: 'Failed to create account' });
	} finally {
		session.endSession();
	}
};

// !!! Updates the account
const updateAccount = async (request, response) => {};

// !!! Delete a single account
const deleteAccount = async (request, response) => {};

module.exports = { getAllAccount, postAccount, updateAccount, deleteAccount };
