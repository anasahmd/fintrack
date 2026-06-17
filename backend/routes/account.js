
import accountController from '../controllers/account.js';
import userExtractor from '../middlewares/userExtractor.js';

import express from 'express';
const accountRouter = express.Router();

accountRouter
	.route('/')
	.get(accountController.getAllAccount)
	.post(accountController.postAccount);

export default accountRouter;
