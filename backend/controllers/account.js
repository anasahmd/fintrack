import mongoose from 'mongoose';
import Account from '../models/account.js';
import { accountSchema } from '../validations/account.js';
import Transaction from '../models/transaction.js';
import Category from '../models/category.js';

const getAllAccount = async (request, response) => {
	const accounts = await Account.find({
		user: request.user._id,
		isActive: true,
	}).sort({ name: 1 });

	return response.status(200).json(accounts);
};

const postAccount = async (request, response, next) => {
	const validatedData = await accountSchema.validateAsync(request.body);

	const initialBalance = Number(request.body.balance) || 0;

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const [account] = await Account.create(
			[{ ...validatedData, user: request.user._id }],
			{ session },
		);

		if (initialBalance !== 0) {
			const transactionType = initialBalance > 0 ? 'Income' : 'Expense';
			const absoluteAmount = Math.abs(initialBalance);

			let systemCategory = await Category.findOne({
				name: 'Starting Balance',
				type: transactionType,
				user: request.user._id,
			}).session(session);

			if (!systemCategory) {
				const [newCategory] = await Category.create(
					[
						{
							name: 'Starting Balance',
							emoji: '🏦',
							color: 'grey',
							type: transactionType,
							user: request.user._id,
						},
					],
					{ session },
				);

				systemCategory = newCategory;
			}

			await Transaction.create(
				[
					{
						user: request.user._id,
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
		next(error);
	} finally {
		session.endSession();
	}
};

// !!! Updates the account
const updateAccount = async (request, response) => {};

// !!! Delete a single account
const deleteAccount = async (request, response) => {};

export default { getAllAccount, postAccount, updateAccount, deleteAccount };
