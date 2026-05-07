const catchAsync = require('../utils/catchAsync');
const accountController = require('../controllers/account');
const userExtractor = require('../middlewares/userExtractor');

const accountRouter = require('express').Router();

accountRouter
	.route('/')
	.get(catchAsync(accountController.getAllAccount))
	.post(catchAsync(accountController.postAccount));

module.exports = accountRouter;
