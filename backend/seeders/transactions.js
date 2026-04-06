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

		// 1. Reset Database
		await Transaction.deleteMany({});
		await Category.deleteMany({});
		console.log('Cleared existing transactions and categories.');

		// 2. Setup Default User
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

		// 3. Insert Robust Categories (with Catppuccin color tokens)
		const categoriesData = [
			// Income
			{
				name: 'Salary',
				type: 'Income',
				emoji: '💰',
				color: 'green',
				user: defaultUser._id,
			},
			{
				name: 'Freelance',
				type: 'Income',
				emoji: '💻',
				color: 'teal',
				user: defaultUser._id,
			},
			{
				name: 'Investments',
				type: 'Income',
				emoji: '📈',
				color: 'sky',
				user: defaultUser._id,
			},
			{
				name: 'Gifts & Refunds',
				type: 'Income',
				emoji: '🎁',
				color: 'lavender',
				user: defaultUser._id,
			},

			// Expenses
			{
				name: 'Housing',
				type: 'Expense',
				emoji: '🏠',
				color: 'mauve',
				user: defaultUser._id,
			},
			{
				name: 'Food & Dining',
				type: 'Expense',
				emoji: '🍔',
				color: 'peach',
				user: defaultUser._id,
			},
			{
				name: 'Utilities',
				type: 'Expense',
				emoji: '⚡',
				color: 'sky',
				user: defaultUser._id,
			},
			{
				name: 'Transportation',
				type: 'Expense',
				emoji: '🚗',
				color: 'yellow',
				user: defaultUser._id,
			},
			{
				name: 'Health',
				type: 'Expense',
				emoji: '🏥',
				color: 'teal',
				user: defaultUser._id,
			},
			{
				name: 'Shopping',
				type: 'Expense',
				emoji: '🛍️',
				color: 'pink',
				user: defaultUser._id,
			},
			{
				name: 'Entertainment',
				type: 'Expense',
				emoji: '🍿',
				color: 'lavender',
				user: defaultUser._id,
			},
			{
				name: 'Personal Care',
				type: 'Expense',
				emoji: '💈',
				color: 'pink',
				user: defaultUser._id,
			},
			{
				name: 'Education',
				type: 'Expense',
				emoji: '📚',
				color: 'sky',
				user: defaultUser._id,
			},
			{
				name: 'Debt & Loans',
				type: 'Expense',
				emoji: '💳',
				color: 'red',
				user: defaultUser._id,
			},
			{
				name: 'Miscellaneous',
				type: 'Expense',
				emoji: '✨',
				color: 'mauve',
				user: defaultUser._id,
			},
		];

		const savedCategories = await Category.insertMany(categoriesData);
		console.log('Seeded relational categories.');

		const getCategoryId = (name) => {
			const category = savedCategories.find((cat) => cat.name === name);
			return category._id;
		};

		// 4. Insert Transactions covering every category
		const dummyTransactions = [
			// --- INCOME ---
			{
				user: defaultUser._id,
				description: 'Tech Lead Salary',
				amount: 120000,
				currency: 'INR',
				type: 'Income',
				category: getCategoryId('Salary'),
				tags: ['job', 'monthly'],
				date: new Date('2026-03-01T09:00:00Z'),
			},
			{
				user: defaultUser._id,
				description: 'MERN Stack Freelance Gig',
				amount: 35000,
				currency: 'INR',
				type: 'Income',
				category: getCategoryId('Freelance'),
				tags: ['webdev', 'side-hustle'],
				date: new Date('2026-03-12T14:30:00Z'),
			},
			{
				user: defaultUser._id,
				description: 'Mutual Fund Dividend',
				amount: 4500,
				currency: 'INR',
				type: 'Income',
				category: getCategoryId('Investments'),
				tags: ['passive'],
				date: new Date('2026-03-25T10:00:00Z'),
			},
			{
				user: defaultUser._id,
				description: 'Cashback from Amazon',
				amount: 350,
				currency: 'INR',
				type: 'Income',
				category: getCategoryId('Gifts & Refunds'),
				tags: ['cashback'],
				date: new Date('2026-03-28T16:15:00Z'),
			},

			// --- EXPENSES ---
			{
				user: defaultUser._id,
				description: 'Apartment Rent - HSR Layout',
				amount: 32000,
				currency: 'INR',
				type: 'Expense',
				category: getCategoryId('Housing'),
				tags: ['rent', 'essential'],
				date: new Date('2026-03-02T10:00:00Z'),
			},
			{
				user: defaultUser._id,
				description: 'Electricity & Broadband',
				amount: 3400,
				currency: 'INR',
				type: 'Expense',
				category: getCategoryId('Utilities'),
				tags: ['bills'],
				date: new Date('2026-03-04T11:00:00Z'),
			},
			{
				user: defaultUser._id,
				description: 'Monthly Groceries',
				amount: 8500,
				currency: 'INR',
				type: 'Expense',
				category: getCategoryId('Food & Dining'),
				tags: ['supermarket', 'essential'],
				date: new Date('2026-03-05T18:30:00Z'),
			},
			{
				user: defaultUser._id,
				description: 'Swiggy Dinner',
				amount: 650,
				currency: 'INR',
				type: 'Expense',
				category: getCategoryId('Food & Dining'),
				tags: ['takeout'],
				date: new Date('2026-03-08T20:45:00Z'),
			},
			{
				user: defaultUser._id,
				description: 'Namma Metro Pass Reload',
				amount: 1500,
				currency: 'INR',
				type: 'Expense',
				category: getCategoryId('Transportation'),
				tags: ['commute'],
				date: new Date('2026-03-09T08:15:00Z'),
			},
			{
				user: defaultUser._id,
				description: 'Uber to Indiranagar',
				amount: 450,
				currency: 'INR',
				type: 'Expense',
				category: getCategoryId('Transportation'),
				tags: ['cab'],
				date: new Date('2026-03-14T19:00:00Z'),
			},
			{
				user: defaultUser._id,
				description: 'Pharmacy',
				amount: 850,
				currency: 'INR',
				type: 'Expense',
				category: getCategoryId('Health'),
				tags: ['medicine'],
				date: new Date('2026-03-15T13:20:00Z'),
			},
			{
				user: defaultUser._id,
				description: 'New Mechanical Keyboard',
				amount: 7500,
				currency: 'INR',
				type: 'Expense',
				category: getCategoryId('Shopping'),
				tags: ['tech', 'setup'],
				date: new Date('2026-03-18T15:45:00Z'),
			},
			{
				user: defaultUser._id,
				description: 'Netflix & Spotify Subscriptions',
				amount: 800,
				currency: 'INR',
				type: 'Expense',
				category: getCategoryId('Entertainment'),
				tags: ['subscriptions'],
				date: new Date('2026-03-20T10:00:00Z'),
			},
			{
				user: defaultUser._id,
				description: 'Haircut',
				amount: 450,
				currency: 'INR',
				type: 'Expense',
				category: getCategoryId('Personal Care'),
				tags: ['salon'],
				date: new Date('2026-03-22T14:00:00Z'),
			},
			{
				user: defaultUser._id,
				description: 'Advanced Cloud Architecture Course',
				amount: 4500,
				currency: 'INR',
				type: 'Expense',
				category: getCategoryId('Education'),
				tags: ['learning', 'career'],
				date: new Date('2026-03-24T11:30:00Z'),
			},
			{
				user: defaultUser._id,
				description: 'Laptop EMI',
				amount: 8000,
				currency: 'INR',
				type: 'Expense',
				category: getCategoryId('Debt & Loans'),
				tags: ['emi'],
				date: new Date('2026-03-26T09:00:00Z'),
			},
			{
				user: defaultUser._id,
				description: 'Donation to Open Source Project',
				amount: 1000,
				currency: 'INR',
				type: 'Expense',
				category: getCategoryId('Miscellaneous'),
				tags: ['charity'],
				date: new Date('2026-03-30T16:00:00Z'),
			},
			{
				user: defaultUser._id,
				description: 'Coffee Shop Coding Session',
				amount: 350,
				currency: 'INR',
				type: 'Expense',
				category: getCategoryId('Food & Dining'),
				tags: ['coffee'],
				date: new Date('2026-04-02T16:00:00Z'),
			},
		];

		await Transaction.insertMany(dummyTransactions);
		console.log(
			`Successfully seeded database with ${dummyTransactions.length} structured transactions!`,
		);

		mongoose.connection.close();
		process.exit(0);
	} catch (error) {
		console.error('Error seeding database:', error);
		mongoose.connection.close();
		process.exit(1);
	}
};

seedDatabase();
