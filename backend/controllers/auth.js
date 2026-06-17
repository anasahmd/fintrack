import bcrypt from 'bcrypt';
import User from '../models/user.js';
import Category from '../models/category.js';
import * as config from '../utils/config.js';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../validations/auth.js';

const DEFAULT_CATEGORIES = [
	// --- INCOME ---
	{ name: 'Salary', type: 'Income', emoji: '💰', color: 'green' },
	{ name: 'Freelance', type: 'Income', emoji: '💻', color: 'sky' },
	{ name: 'Investments', type: 'Income', emoji: '📈', color: 'blue' },
	{
		name: 'Gifts & Refunds',
		type: 'Income',
		emoji: '🎁',
		color: 'lavender',
	},

	// --- EXPENSES ---
	// The Essentials
	{ name: 'Housing', type: 'Expense', emoji: '🏠', color: 'mauve' },
	{ name: 'Food & Dining', type: 'Expense', emoji: '🍔', color: 'peach' },
	{ name: 'Utilities', type: 'Expense', emoji: '⚡', color: 'sky' },
	{
		name: 'Transportation',
		type: 'Expense',
		emoji: '🚗',
		color: 'yellow',
	},
	{ name: 'Health', type: 'Expense', emoji: '🏥', color: 'teal' },

	// Lifestyle & Discretionary
	{ name: 'Shopping', type: 'Expense', emoji: '🛍️', color: 'pink' },
	{
		name: 'Entertainment',
		type: 'Expense',
		emoji: '🍿',
		color: 'lavender',
	},
	{ name: 'Personal Care', type: 'Expense', emoji: '💈', color: 'peach' },
	{ name: 'Education', type: 'Expense', emoji: '📚', color: 'blue' },

	// Financial
	{ name: 'Debt & Loans', type: 'Expense', emoji: '💳', color: 'red' },

	// The Catch-All
	{ name: 'Miscellaneous', type: 'Expense', emoji: '✨', color: 'mauve' },
];

const register = async (request, response) => {
	const { name, email, password } = request.body;

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

	const userForToken = {
		email: savedUser.email,
		_id: savedUser._id,
	};

	const token = jwt.sign(userForToken, config.JWT_SECRET);

	response.status(201).json({
		token,
		_id: savedUser._id,
		name: savedUser.name,
		email: savedUser.email,
		currency: savedUser.currency,
	});
};

const login = async (request, response) => {
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
		_id: user._id,
	};

	const token = jwt.sign(userForToken, config.JWT_SECRET);

	response.status(200).send({
		token,
		email: user.email,
		name: user.name,
		currency: user.currency,
	});
};

export default { register, login };
