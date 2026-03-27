const catchAsync = require('../utils/catchAsync');
const categoryController = require('../controllers/category');

const categoryRouter = require('express').Router();

categoryRouter.route('/').get(catchAsync(categoryController.getAllCategories));

module.exports = categoryRouter;
