const bcrypt = require('bcrypt');
const User = require('../models/user');
const Category = require('../models/category');
const config = require('../utils/config');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../validations/auth');

const DEFAULT_CATEGORIES = [
	// Income
	{ name: 'Salary', type: 'Income', emoji: '💰' },
	{ name: 'Freelance', type: 'Income', emoji: '💻' },
	{ name: 'Investments', type: 'Income', emoji: '📈' },

	// Expenses
	{ name: 'Housing', type: 'Expense', emoji: '🏠' },
	{ name: 'Food', type: 'Expense', emoji: '🍔' },
	{ name: 'Transportation', type: 'Expense', emoji: '🚗' },
	{ name: 'Utilities', type: 'Expense', emoji: '⚡' },
	{ name: 'Health', type: 'Expense', emoji: '🏥' },
	{ name: 'Other', type: 'Expense', emoji: '🛍️' },
];

const register = async (request, response, next) => {
	const { name, email, password } = request.body;

	try {
		try {
			await registerSchema.validateAsync({ name, email, password });
		} catch (e) {
			return response.status(400).json({ error: e.details[0].message });
		}

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return response
				.status(400)
				.json({ error: 'An account with this email already exists' });
		}

		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(password, saltRounds);

		const newUser = new User({
			name,
			email,
			passwordHash,
		});

		const savedUser = await newUser.save();
		const categoriesToInsert = DEFAULT_CATEGORIES.map((cat) => ({
			...cat,
			user: savedUser._id,
		}));

		await Category.insertMany(categoriesToInsert);
		response.status(201).json({
			id: savedUser._id,
			name: savedUser.name,
			email: savedUser.email,
			currency: savedUser.currency,
		});
	} catch (e) {
		next(e);
	}
};

const login = async (request, response, next) => {
	const { email, password } = request.body;

	try {
		await loginSchema.validateAsync({ email, password });
	} catch (e) {
		return response.status(400).json({ error: e.details[0].message });
	}

	const user = await User.findOne({ email });

	const passwordCorrect =
		user === null ? false : await bcrypt.compare(password, user.passwordHash);

	if (!(user && passwordCorrect)) {
		return response.status(401).json({ error: 'Wrong credentials' });
	}

	const userForToken = {
		email: user.email,
		id: user._id,
	};

	const token = jwt.sign(userForToken, config.JWT_SECRET);

	response.status(200).send({
		token,
		email: user.email,
		name: user.name,
		currency: user.currency,
	});
};

module.exports = { register, login };
