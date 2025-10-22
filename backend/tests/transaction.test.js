const assert = require('node:assert');
const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Transaction = require('../models/transaction');
const helper = require('./test_helper');
const User = require('../models/user');

const api = supertest(app);

describe('actions requiring authentication', () => {
	let token;
	let userId;

	beforeEach(async () => {
		await User.deleteMany({});
		await Transaction.deleteMany({});

		const authData = await helper.getAuthTokenAndUserId();

		token = authData.token;
		userId = authData.userId;

		const transactionWithUser = helper.demoTransactions.map((transaction) => ({
			...transaction,
			user: userId,
		}));

		await Transaction.insertMany(transactionWithUser);
	});

	test('post request creates a new transaction', async () => {
		const newTransaction = {
			amount: 10,
			type: 'Expense',
			category: 'Food',
			description: 'Chai',
			tags: ['chai'],
			date: new Date('2025-10-01T10:00:00Z'),
		};

		await api
			.post('/api/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(newTransaction)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const transactionAfterPost = await helper.transactionsInDb();

		assert.strictEqual(
			transactionAfterPost.length,
			helper.demoTransactions.length + 1
		);

		const descriptions = await transactionAfterPost.map((t) => t.description);
		assert(descriptions.includes('Chai'));
	});

	test('post request succeeds even if optional fields (tags, description, date) are missing', async () => {
		const minimalTransaction = {
			amount: 50,
			type: 'Expense',
			category: 'Snacks',
		};

		const response = await api
			.post('/api/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(minimalTransaction)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		assert.strictEqual(response.body.description, '');
		assert.deepStrictEqual(response.body.tags, []);
		assert(response.body.date);

		const transactionsAtEnd = await helper.transactionsInDb();
		assert.strictEqual(
			transactionsAtEnd.length,
			helper.demoTransactions.length + 1
		);
	});

	test('post request fails with 401 authorized if token is not provided', async () => {
		const newTransaction = {
			amount: 10,
			type: 'Expense',
			category: 'Food',
			description: 'Chai',
			tags: ['chai'],
			date: new Date('2025-10-01T10:00:00Z'),
		};

		await api.post('/api/transactions').send(newTransaction).expect(401);

		const transactionAfterPost = await helper.transactionsInDb();

		assert.strictEqual(
			transactionAfterPost.length,
			helper.demoTransactions.length
		);
	});

	test('post request fails if amount is not given', async () => {
		const newTransaction = {
			type: 'Expense',
			category: 'Food',
			description: 'Chai',
			tags: ['chai'],
			date: new Date('2025-10-01T10:00:00Z'),
		};

		const response = await api
			.post('/api/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(newTransaction)
			.expect(400);

		const transactionAfterPost = await helper.transactionsInDb();

		assert.strictEqual(
			transactionAfterPost.length,
			helper.demoTransactions.length
		);

		assert.strictEqual(response.body.error, 'Amount is required');
	});

	test('post request fails if amount is not a number', async () => {
		const newTransaction = {
			amount: 'ten',
			type: 'Expense',
			category: 'Food',
			description: 'Chai',
			tags: ['chai'],
			date: new Date('2025-10-01T10:00:00Z'),
		};

		const response = await api
			.post('/api/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(newTransaction)
			.expect(400);

		const transactionAfterPost = await helper.transactionsInDb();

		assert.strictEqual(
			transactionAfterPost.length,
			helper.demoTransactions.length
		);

		assert.strictEqual(response.body.error, 'Amount must be a number');
	});

	test('post request fails if type is not given', async () => {
		const newTransaction = {
			amount: 10,
			category: 'Food',
			description: 'Chai',
			tags: ['chai'],
			date: new Date('2025-10-01T10:00:00Z'),
		};

		const response = await api
			.post('/api/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(newTransaction)
			.expect(400);

		const transactionAfterPost = await helper.transactionsInDb();

		assert.strictEqual(
			transactionAfterPost.length,
			helper.demoTransactions.length
		);

		assert.strictEqual(response.body.error, 'Type is required');
	});

	test('post request fails if type is neither Income nor Expense', async () => {
		const newTransaction = {
			amount: 10,
			type: 'Incorrect',
			category: 'Food',
			description: 'Chai',
			tags: ['chai'],
			date: new Date('2025-10-01T10:00:00Z'),
		};

		const response = await api
			.post('/api/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(newTransaction)
			.expect(400);

		const transactionAfterPost = await helper.transactionsInDb();

		assert.strictEqual(
			transactionAfterPost.length,
			helper.demoTransactions.length
		);

		assert.strictEqual(
			response.body.error,
			'Type must be either "Income" or "Expense"'
		);
	});

	test('post request fails if category is not given', async () => {
		const newTransaction = {
			amount: 10,
			type: 'Expense',
			description: 'Chai',
			tags: ['chai'],
			date: new Date('2025-10-01T10:00:00Z'),
		};

		const response = await api
			.post('/api/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(newTransaction)
			.expect(400);

		const transactionAfterPost = await helper.transactionsInDb();

		assert.strictEqual(
			transactionAfterPost.length,
			helper.demoTransactions.length
		);

		assert.strictEqual(response.body.error, 'Category is required');
	});

	test('post request fails if category is an empty string', async () => {
		const newTransaction = {
			amount: 10,
			type: 'Expense',
			description: 'Chai',
			category: '',
			tags: ['chai'],
			date: new Date('2025-10-01T10:00:00Z'),
		};

		const response = await api
			.post('/api/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(newTransaction)
			.expect(400);

		const transactionAfterPost = await helper.transactionsInDb();

		assert.strictEqual(
			transactionAfterPost.length,
			helper.demoTransactions.length
		);

		assert.strictEqual(response.body.error, 'Category cannot be empty');
	});

	test('post request fails if description is longer than 250 characters', async () => {
		const longDescription = 'a'.repeat(251);
		const newTransaction = {
			amount: 10,
			type: 'Expense',
			description: longDescription,
			category: 'Food',
			tags: ['chai'],
			date: new Date('2025-10-01T10:00:00Z'),
		};

		const response = await api
			.post('/api/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(newTransaction)
			.expect(400);

		const transactionAfterPost = await helper.transactionsInDb();

		assert.strictEqual(
			transactionAfterPost.length,
			helper.demoTransactions.length
		);

		assert.strictEqual(
			response.body.error,
			'Description cannot be longer than 250 characters'
		);
	});

	test('post request fails if tag contains empty string', async () => {
		const newTransaction = {
			amount: 10,
			type: 'Expense',
			description: 'Chai',
			category: 'Food',
			tags: ['', 'chai'],
			date: new Date('2025-10-01T10:00:00Z'),
		};

		const response = await api
			.post('/api/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(newTransaction)
			.expect(400);

		const transactionAfterPost = await helper.transactionsInDb();

		assert.strictEqual(
			transactionAfterPost.length,
			helper.demoTransactions.length
		);

		assert.strictEqual(response.body.error, 'Tags cannot be empty');
	});

	test('post request fails if tag contains string longer than 30 characters', async () => {
		const longTag = 'a'.repeat(31);
		const newTransaction = {
			amount: 10,
			type: 'Expense',
			description: 'Chai',
			category: 'Food',
			tags: [longTag, 'chai'],
			date: new Date('2025-10-01T10:00:00Z'),
		};

		const response = await api
			.post('/api/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(newTransaction)
			.expect(400);

		const transactionAfterPost = await helper.transactionsInDb();

		assert.strictEqual(
			transactionAfterPost.length,
			helper.demoTransactions.length
		);

		assert.strictEqual(
			response.body.error,
			'Each tag cannot be longer than 30 characters'
		);
	});

	test('post request fails if transaction contains more than 10 tags', async () => {
		const longTagsArray = new Array(11).fill('tag');
		const newTransaction = {
			amount: 10,
			type: 'Expense',
			description: 'Chai',
			category: 'Food',
			tags: longTagsArray,
			date: new Date('2025-10-01T10:00:00Z'),
		};

		const response = await api
			.post('/api/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(newTransaction)
			.expect(400);

		const transactionAfterPost = await helper.transactionsInDb();

		assert.strictEqual(
			transactionAfterPost.length,
			helper.demoTransactions.length
		);

		assert.strictEqual(response.body.error, 'You can add a maximum of 10 tags');
	});

	test('post request fails if transaction containns invalid date', async () => {
		const newTransaction = {
			amount: 10,
			type: 'Expense',
			description: 'Chai',
			category: 'Food',
			tags: ['chai'],
			date: 'fake date',
		};

		const response = await api
			.post('/api/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(newTransaction)
			.expect(400);

		const transactionAfterPost = await helper.transactionsInDb();

		assert.strictEqual(
			transactionAfterPost.length,
			helper.demoTransactions.length
		);

		assert.strictEqual(response.body.error, 'Date must be a valid date format');
	});
});

after(async () => {
	await mongoose.connection.close();
});
