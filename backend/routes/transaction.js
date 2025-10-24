const catchAsync = require('../utils/catchAsync');
const transactionController = require('../controllers/transaction');
const userExtractor = require('../middlewares/userExtractor');

const transactionRouter = require('express').Router();

transactionRouter
	.route('/')
	.get(catchAsync(transactionController.getAllTransaction))
	.post(catchAsync(transactionController.postTransaction));

transactionRouter
	.route('/tags')
	.get(catchAsync(transactionController.getAllTags));

transactionRouter
	.route('/:id')
	.get(catchAsync(transactionController.getTransaction))
	.put(catchAsync(transactionController.updateTransaction))
	.delete(catchAsync(transactionController.deleteTransaction));

module.exports = transactionRouter;
