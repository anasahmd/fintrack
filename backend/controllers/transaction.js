const transactionRouter = require('express').Router();
const Transaction = require('../models/transaction');
const Category = require('../models/category');
const {
	transactionSchema,
	updateTransactionSchema,
} = require('../validations/transaction');

const getAllTransaction = async (request, response, next) => {
	const transactions = await Transaction.find({ user: request.user.id })
		.populate('category', 'name emoji')
		.sort({ date: -1 });
	return response.status(200).json(transactions);
};

const getTransaction = async (request, response, next) => {
	const transaction = await Transaction.findById(request.params.id).populate(
		'category',
		'name emoji',
	);

	if (!transaction) {
		return response.status(404).json({ error: 'Transaction not found' });
	}

	if (request.user.id.toString() !== transaction.user.toString()) {
		return response.status(403).json({ error: 'User not authorized' });
	}
	return response.status(200).json(transaction);
};

const postTransaction = async (request, response, next) => {
	try {
		await transactionSchema.validateAsync(request.body);
	} catch (e) {
		return response.status(400).json({ error: e.details[0].message });
	}

	const newTransaction = new Transaction({
		...request.body,
		user: request.user.id,
	});

	const savedTransaction = await newTransaction.save();
	await savedTransaction.populate('category', 'name emoji');

	return response.status(201).json(savedTransaction);
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
