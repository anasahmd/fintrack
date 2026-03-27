const Category = require('../models/category');

const getAllCategories = async (request, response) => {
	const categories = await Category.find({ user: request.user._id });
	return response.status(200).json(categories);
};

module.exports = {
	getAllCategories,
};
