
import transactionController from '../controllers/transaction.js';
import userExtractor from '../middlewares/userExtractor.js';

import express from 'express';
const transactionRouter = express.Router();

transactionRouter
	.route('/')
	.get(transactionController.getAllTransaction)
	.post(transactionController.postTransaction);

transactionRouter
	.route('/tags')
	.get(transactionController.getAllTags);

transactionRouter
	.route('/:id')
	.get(transactionController.getTransaction)
	.put(transactionController.updateTransaction)
	.delete(transactionController.deleteTransaction);

export default transactionRouter;
