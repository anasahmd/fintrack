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

	const transactionObjects = helper.demoTransactions.map(
		(tx) =>
			new Transaction({
				...tx,
				user: testUserId,
				account: testAccountId,
				category: testCategoryId,
			}),
	);

	const promiseArray = transactionObjects.map((tx) => tx.save());
	await Promise.all(promiseArray);
});

after(async () => {
	await mongoose.connection.close();
});

describe('POST /api/transactions', () => {
	test('creates a new transaction successfully', async () => {
		await api
			.post('/api/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(validTransaction)
			.expect(201);
	});

	test('fails with 401 unauthorized if token is not provided', async () => {
		await api.post('/api/transactions').send(validTransaction).expect(401);
	});

	test('successfully deducts amount from account balance for an Expense', async () => {
		const accountBefore = await Account.findById(testAccountId);

		await api
			.post('/api/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(validTransaction)
			.expect(201);

		const accountAfter = await Account.findById(testAccountId);

		assert.strictEqual(
			accountAfter.balance,
			accountBefore.balance - validTransaction.amount,
		);
	});

	test('successfully adds amount to account balance for an Income', async () => {
		const accountBefore = await Account.findById(testAccountId);

		const incomeTransaction = {
			...validTransaction,
			type: 'Income',
			amount: 500,
		};

		await api
			.post('/api/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(incomeTransaction)
			.expect(201);

		const accountAfter = await Account.findById(testAccountId);

		assert.strictEqual(accountAfter.balance, accountBefore.balance + 500);
	});

	test('fails with 404 if the account does not exist or is inactive', async () => {
		const fakeAccountId = new mongoose.Types.ObjectId();

		const response = await api
			.post('/api/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send({ ...validTransaction, account: fakeAccountId })
			.expect(404);

		assert.strictEqual(response.body.error, 'Account not found or inactive');
	});

	describe('Validation rules', () => {
		const badPayloads = [
			{
				desc: 'amount is missing',
				override: { amount: undefined },
				expectedError: 'Amount is required',
			},
			{
				desc: 'account is missing',
				override: { account: undefined },
				expectedError: 'Account is required',
			},
			{
				desc: 'amount is not a number',
				override: { amount: 'ten' },
				expectedError: 'Amount must be a number',
			},
			{
				desc: 'type is invalid',
				override: { type: 'Magic' },
				expectedError: 'Type must be either "Income" or "Expense"',
			},
			{
				desc: 'title is too long',
				override: { title: 'a'.repeat(31) },
				expectedError: 'Title cannot be longer than 30 characters',
			},
			{
				desc: 'too many tags',
				override: { tags: new Array(11).fill('tag') },
				expectedError: 'You can add a maximum of 10 tags',
			},
			{
				desc: 'invalid date format',
				override: { date: 'fake date' },
				expectedError: 'Date must be a valid date format',
			},
		];

		for (const { desc, override, expectedError } of badPayloads) {
			test(`fails when ${desc}`, async () => {
				const badTransaction = { ...validTransaction, ...override };

				const response = await api
					.post('/api/transactions')
					.set('Authorization', `Bearer ${token}`)
					.send(badTransaction)
					.expect(400);

				assert.strictEqual(response.body.error, expectedError);
			});
		}
	});
});
