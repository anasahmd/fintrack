const transactionRouter = require('express').Router();
const Transaction = require('../models/transaction');
const User = require('../models/user');

//! Gets all user transaction
const getAllTransaction = async (request, response, next) => {
	return response.status(501).json({ error: 'Not Implemented' });
};

//! Get a single transaction
const getTransaction = async (request, response, next) => {
	return response.status(501).json({ error: 'Not Implemented' });
};

//! Add transaction
const postTransaction = async (request, response, next) => {
	return response.status(501).json({ error: 'Not Implemented' });
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
