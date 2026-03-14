const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Transaction = require('../models/transaction');
const User = require('../models/user');
const { MONGODB_URI } = require('../utils/config');

const seedDatabase = async () => {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log('Connected to MongoDB for seeding...');

		// Clear existing transactions to prevent duplicates
		await Transaction.deleteMany({});
		console.log('Cleared existing transactions.');

		// Ensure a default user exists for the relational mapping
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

		// Define the data strictly matching your schema
		const dummyTransactions = [
			{
				user: defaultUser._id,
				description: 'Monthly Salary',
				amount: 85000,
				type: 'Income',
				category: 'Salary',
				tags: ['job', 'monthly'],
				date: new Date('2026-03-01'),
			},
			{
				user: defaultUser._id,
				description: 'Apartment Rent',
				amount: 25000,
				type: 'Expense',
				category: 'Housing',
				tags: ['rent', 'essential'],
				date: new Date('2026-03-02'),
			},
			{
				user: defaultUser._id,
				description: 'Groceries',
				amount: 4500,
				type: 'Expense',
				category: 'Food',
				tags: ['supermarket'],
				date: new Date('2026-03-05'),
			},
			{
				user: defaultUser._id,
				description: 'Freelance Project',
				amount: 15000,
				type: 'Income',
				category: 'Freelance',
				tags: ['webdev'],
				date: new Date('2026-03-10'),
			},
			{
				user: defaultUser._id,
				description: 'Gym Membership',
				amount: 1500,
				type: 'Expense',
				category: 'Health',
				tags: ['subscription'],
				date: new Date('2026-03-14'),
			},
		];

		// Bulk insert
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
