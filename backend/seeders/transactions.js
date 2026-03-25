const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Transaction = require('../models/transaction');
const User = require('../models/user');
const Category = require('../models/category');
const { MONGODB_URI } = require('../utils/config');

const seedDatabase = async () => {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log('Connected to MongoDB for seeding...');

		await Transaction.deleteMany({});
		await Category.deleteMany({});
		console.log('Cleared existing transactions and categories.');

		let defaultUser = await User.findOne({ email: 'demo@example.com' });

		if (!defaultUser) {
			const passwordHash = await bcrypt.hash('secret', 10);
			defaultUser = new User({
				name: 'Anas',
				email: 'demo@example.com',
				passwordHash,
				currency: 'INR',
			});
			await defaultUser.save();
			console.log('Created default demo user.');
		}

		const categoriesData = [
			{ name: 'Salary', type: 'Income', emoji: '💰', user: defaultUser._id },
			{ name: 'Freelance', type: 'Income', emoji: '💻', user: defaultUser._id },
			{ name: 'Housing', type: 'Expense', emoji: '🏠', user: defaultUser._id },
			{ name: 'Food', type: 'Expense', emoji: '🍔', user: defaultUser._id },
			{ name: 'Health', type: 'Expense', emoji: '🏥', user: defaultUser._id },
		];

		const savedCategories = await Category.insertMany(categoriesData);
		console.log('Seeded relational categories.');

		const getCategoryId = (name) => {
			const category = savedCategories.find((cat) => cat.name === name);
			return category._id;
		};

		const dummyTransactions = [
			{
				user: defaultUser._id,
				description: 'Monthly Salary',
				amount: 85000,
				type: 'Income',
				category: getCategoryId('Salary'),
				tags: ['job', 'monthly'],
				date: new Date('2026-03-01'),
			},
			{
				user: defaultUser._id,
				description: 'Apartment Rent',
				amount: 25000,
				type: 'Expense',
				category: getCategoryId('Housing'),
				tags: ['rent', 'essential'],
				date: new Date('2026-03-02'),
			},
			{
				user: defaultUser._id,
				description: 'Groceries',
				amount: 4500,
				type: 'Expense',
				category: getCategoryId('Food'),
				tags: ['supermarket'],
				date: new Date('2026-03-05'),
			},
			{
				user: defaultUser._id,
				description: 'Freelance Project',
				amount: 15000,
				type: 'Income',
				category: getCategoryId('Freelance'),
				tags: ['webdev'],
				date: new Date('2026-03-10'),
			},
			{
				user: defaultUser._id,
				description: 'Gym Membership',
				amount: 1500,
				type: 'Expense',
				category: getCategoryId('Health'),
				tags: ['subscription'],
				date: new Date('2026-03-14'),
			},
		];

		await Transaction.insertMany(dummyTransactions);
		console.log('Successfully seeded database with structured transactions!');

		mongoose.connection.close();
		process.exit(0);
	} catch (error) {
		console.error('Error seeding database:', error);
		mongoose.connection.close();
		process.exit(1);
	}
};

seedDatabase();
