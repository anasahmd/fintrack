const transactionRouter = require('express').Router();
const Transaction = require('../models/transaction');
const User = require('../models/user');
const { transactionSchema } = require('../validations/transaction');

//! Gets all user transaction
const getAllTransaction = async (request, response, next) => {
	return response.status(501).json({ error: 'Not Implemented' });
};

//! Get a single transaction
const getTransaction = async (request, response, next) => {
	return response.status(501).json({ error: 'Not Implemented' });
};

const postTransaction = async (request, response, next) => {
	try {
		await transactionSchema.validateAsync(request.body);
	} catch (e) {
		return response.status(400).json({ error: e.details[0].message });
	}

	const newTransaction = new Transaction({
		...request.body,
		user: request.user._id,
	});

	const savedTransaction = await newTransaction.save();

	return response.status(201).json(savedTransaction);
};

//! Update transaction
const updateTransaction = async (request, response, next) => {
	return response.status(501).json({ error: 'Not Implemented' });
};

//! Delete transaction
const deleteTransaction = async (request, response, next) => {
	return response.status(501).json({ error: 'Not Implemented' });
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
