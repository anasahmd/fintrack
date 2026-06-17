
import categoryController from '../controllers/category.js';

import express from 'express';
const categoryRouter = express.Router();

categoryRouter.route('/').get(categoryController.getAllCategories);

export default categoryRouter;
