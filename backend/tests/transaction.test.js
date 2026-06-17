const mongoose = require('mongoose');
const supertest = require('supertest');
const assert = require('node:assert/strict');
const { test, after, beforeEach, describe } = require('node:test');

const app = require('../app');
const helper = require('./test_helper');
const Transaction = require('../models/transaction');
const User = require('../models/user');
const Account = require('../models/account');
const Category = require('../models/category');

const api = supertest(app);

let token;
let testUserId;
let testAccountId;
let testCategoryId;
let validTransaction;

describe('Transaction API - Happy Path', () => {
	beforeEach(async () => {
		await Transaction.deleteMany({});
		await User.deleteMany({});
		await Account.deleteMany({});
		await Category.deleteMany({});

		const authData = await helper.getAuthTokenAndUserId();
		token = authData.token;
		testUserId = authData.userId;

		const account = new Account({
			name: 'Test HDFC Bank',
			type: 'Bank',
			currency: 'INR',
			balance: 50000,
			user: testUserId,
		});
		await account.save();
		testAccountId = account._id.toString();

		const category = new Category({
			name: 'General',
			emoji: '📝',
			color: 'teal',
			type: 'Expense',
			user: testUserId,
		});
		await category.save();
		testCategoryId = category._id.toString();

		validTransaction = {
			title: 'Morning Coffee',
			amount: 10,
			type: 'Expense',
			category: testCategoryId,
			account: testAccountId,
			currency: 'INR',
			description: 'Chai',
			tags: ['chai'],
			date: new Date('2025-10-01T10:00:00Z').toISOString(),
		};
	});

	test('creates a new transaction successfully and updates account balance', async () => {
		const accountBefore = await Account.findById(testAccountId);

		await api
			.post('/api/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(validTransaction)
			.expect(201);

		const accountAfter = await Account.findById(testAccountId);

		// Verify core business logic (balance deduction)
		assert.strictEqual(
			accountAfter.balance,
			accountBefore.balance - validTransaction.amount,
		);
	});
});

after(async () => {
	await mongoose.connection.close();
});
