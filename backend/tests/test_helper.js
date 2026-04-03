const Transaction = require('../models/transaction');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');

// !!! Changed the type to expense for all so that test cases can pass for now
const demoTransactions = [
	{
		amount: 50000,
		type: 'Expense',
		description: 'October Paycheck',
		currency: 'INR',
		tags: ['work', 'salary'],
		date: new Date('2025-10-01T10:00:00Z'),
	},
	{
		amount: 8000,
		type: 'Expense',
		description: 'Rent Payment',
		currency: 'INR',
		tags: ['rent', 'bills'],
		date: new Date('2025-10-05T08:00:00Z'),
	},
	{
		amount: 1500,
		type: 'Expense',
		description: 'Weekly Groceries',
		currency: 'INR',
		tags: ['groceries'],
		date: new Date('2025-10-10T18:30:00Z'),
	},
	{
		amount: 250,
		type: 'Expense',
		description: 'Metro card top-up',
		currency: 'INR',
		tags: ['commute'],
		date: new Date('2025-10-15T09:15:00Z'),
	},
	{
		amount: 10000,
		type: 'Expense',
		description: 'Project Payment - Client X',
		currency: 'INR',
		tags: ['work', 'freelance'],
		date: new Date('2025-10-18T15:00:00Z'),
	},
];

const usersInDb = async () => {
	const users = await User.find({});
	return users.map((u) => u.toJSON());
};

const transactionsInDb = async () => {
	const transactions = await Transaction.find({});
	return transactions.map((t) => t.toJSON());
};

const nonExisitingId = async () => {
	const fakeId = new mongoose.Types.ObjectId();
	return fakeId.toString();
};

const getAuthTokenAndUserId = async () => {
	const passwordHash = await bcrypt.hash('secret', 10);
	const user = new User({
		name: 'Test User',
		email: 'testuser@gmail.com',
		passwordHash,
	});

	await user.save();

	const userForToken = {
		email: user.email,
		id: user._id.toString(),
	};

	const token = jwt.sign(userForToken, process.env.JWT_SECRET);

	return { token, userId: user._id.toString() };
};

const createTestUser = async (name, email, password) => {
	const passwordHash = await bcrypt.hash(password, 10);
	const user = new User({ name, email, passwordHash });
	await user.save();
	return user._id.toString();
};

module.exports = {
	usersInDb,
	transactionsInDb,
	demoTransactions,
	getAuthTokenAndUserId,
	createTestUser,
	nonExisitingId,
};
