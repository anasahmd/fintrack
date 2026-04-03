const assert = require('node:assert');
const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Transaction = require('../models/transaction');
const helper = require('./test_helper');
const User = require('../models/user');
const Category = require('../models/category');

const api = supertest(app);

describe('actions requiring authentication', () => {
	let token;
	let userId;
	let testCategoryId;

	beforeEach(async () => {
		await User.deleteMany({});
		await Transaction.deleteMany({});
		await Category.deleteMany({});

		const authData = await helper.getAuthTokenAndUserId();

		token = authData.token;
		userId = authData.userId;

		const testCategory = new Category({
			user: userId,
			name: 'Food',
			type: 'Expense',
			emoji: '🍔',
		});

		const savedCategory = await testCategory.save();
		testCategoryId = savedCategory.id;

		const transactionWithUser = helper.demoTransactions.map((transaction) => ({
			...transaction,
			user: userId,
			category: testCategoryId,
		}));

		await Transaction.insertMany(transactionWithUser);
	});

	describe('POST /api/transactions', () => {
		test('post request creates a new transaction', async () => {
			const newTransaction = {
				amount: 10,
				type: 'Expense',
				category: testCategoryId,
				currency: 'INR',
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
				helper.demoTransactions.length + 1,
			);

			const descriptions = await transactionAfterPost.map((t) => t.description);
			assert(descriptions.includes('Chai'));
		});

		test('post request succeeds even if optional fields (tags, description, date) are missing', async () => {
			const minimalTransaction = {
				amount: 50,
				type: 'Expense',
				category: testCategoryId,
				currency: 'INR',
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
				helper.demoTransactions.length + 1,
			);
		});

		test('post request fails with 401 authorized if token is not provided', async () => {
			const newTransaction = {
				amount: 10,
				type: 'Expense',
				category: testCategoryId,
				currency: 'INR',
				description: 'Chai',
				tags: ['chai'],
				date: new Date('2025-10-01T10:00:00Z'),
			};

			await api.post('/api/transactions').send(newTransaction).expect(401);

			const transactionAfterPost = await helper.transactionsInDb();

			assert.strictEqual(
				transactionAfterPost.length,
				helper.demoTransactions.length,
			);
		});

		test('post request fails if amount is not given', async () => {
			const newTransaction = {
				type: 'Expense',
				category: testCategoryId,
				currency: 'INR',
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
				helper.demoTransactions.length,
			);

			assert.strictEqual(response.body.error, 'Amount is required');
		});

		test('post request fails if amount is not a number', async () => {
			const newTransaction = {
				amount: 'ten',
				type: 'Expense',
				currency: 'INR',
				category: testCategoryId,
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
				helper.demoTransactions.length,
			);

			assert.strictEqual(response.body.error, 'Amount must be a number');
		});

		test('post request fails if type is not given', async () => {
			const newTransaction = {
				amount: 10,
				category: testCategoryId,
				currency: 'INR',
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
				helper.demoTransactions.length,
			);

			assert.strictEqual(response.body.error, 'Type is required');
		});

		test('post request fails if type is neither Income nor Expense', async () => {
			const newTransaction = {
				amount: 10,
				type: 'Incorrect',
				category: testCategoryId,
				currency: 'INR',
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
				helper.demoTransactions.length,
			);

			assert.strictEqual(
				response.body.error,
				'Type must be either "Income" or "Expense"',
			);
		});

		test('post request saves the title successfully when provided', async () => {
			const newTransaction = {
				title: 'Starbucks Coffee',
				amount: 10,
				type: 'Expense',
				currency: 'INR',
				category: testCategoryId,
				description: 'Chai',
				tags: ['chai'],
				date: new Date('2025-10-01T10:00:00Z'),
			};

			const response = await api
				.post('/api/transactions')
				.set('Authorization', `Bearer ${token}`)
				.send(newTransaction)
				.expect(201)
				.expect('Content-Type', /application\/json/);

			assert.strictEqual(response.body.title, 'Starbucks Coffee');
		});

		test('post request fails if title is longer than 30 characters', async () => {
			const longTitle = 'a'.repeat(31); // 31 characters
			const newTransaction = {
				title: longTitle,
				amount: 10,
				currency: 'INR',
				type: 'Expense',
				category: testCategoryId,
				description: 'Chai',
				tags: ['chai'],
				date: new Date('2025-10-01T10:00:00Z'),
			};

			const response = await api
				.post('/api/transactions')
				.set('Authorization', `Bearer ${token}`)
				.send(newTransaction)
				.expect(400);

			assert.strictEqual(
				response.body.error,
				'Title cannot be longer than 30 characters',
			);
		});

		test('post request fails if category is not given', async () => {
			const newTransaction = {
				amount: 10,
				type: 'Expense',
				currency: 'INR',
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
				helper.demoTransactions.length,
			);

			assert.strictEqual(response.body.error, 'Category is required');
		});

		test('post request fails if category is an empty string', async () => {
			const newTransaction = {
				amount: 10,
				type: 'Expense',
				currency: 'INR',
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
				helper.demoTransactions.length,
			);

			assert.strictEqual(response.body.error, 'Category cannot be empty');
		});

		test('post request fails if description is longer than 250 characters', async () => {
			const longDescription = 'a'.repeat(251);
			const newTransaction = {
				amount: 10,
				type: 'Expense',
				description: longDescription,
				currency: 'INR',
				category: testCategoryId,
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
				helper.demoTransactions.length,
			);

			assert.strictEqual(
				response.body.error,
				'Description cannot be longer than 250 characters',
			);
		});

		test('post request fails if tag contains empty string', async () => {
			const newTransaction = {
				amount: 10,
				type: 'Expense',
				currency: 'INR',
				description: 'Chai',
				category: testCategoryId,
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
				helper.demoTransactions.length,
			);

			assert.strictEqual(response.body.error, 'Tags cannot be empty');
		});

		test('post request fails if tag contains string longer than 30 characters', async () => {
			const longTag = 'a'.repeat(31);
			const newTransaction = {
				amount: 10,
				type: 'Expense',
				description: 'Chai',
				currency: 'INR',
				category: testCategoryId,
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
				helper.demoTransactions.length,
			);

			assert.strictEqual(
				response.body.error,
				'Each tag cannot be longer than 30 characters',
			);
		});

		test('post request fails if transaction contains more than 10 tags', async () => {
			const longTagsArray = new Array(11).fill('tag');
			const newTransaction = {
				amount: 10,
				type: 'Expense',
				currency: 'INR',
				description: 'Chai',
				category: testCategoryId,
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
				helper.demoTransactions.length,
			);

			assert.strictEqual(
				response.body.error,
				'You can add a maximum of 10 tags',
			);
		});

		test('post request fails if transaction containns invalid date', async () => {
			const newTransaction = {
				amount: 10,
				type: 'Expense',
				currency: 'INR',
				description: 'Chai',
				category: testCategoryId,
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
				helper.demoTransactions.length,
			);

			assert.strictEqual(
				response.body.error,
				'Date must be a valid date format',
			);
		});
	});

	describe('when multiple user exists', () => {
		let userIdB;
		let transactionOfUserB;
		let categoryOfUserB;

		beforeEach(async () => {
			userIdB = await helper.createTestUser(
				'User B',
				'userb@example.com',
				'passwordB',
			);

			const testCategoryB = new Category({
				user: userIdB,
				name: 'Other',
				type: 'Expense',
			});
			categoryOfUserB = await testCategoryB.save();

			transactionOfUserB = new Transaction({
				amount: 999,
				type: 'Expense',
				category: categoryOfUserB.id,
				user: userIdB,
			});
			await transactionOfUserB.save();
		});

		describe('GET /api/transactions', () => {
			test('fetches all the transaction for logged in user successfully', async () => {
				const response = await api
					.get('/api/transactions')
					.set('Authorization', `Bearer ${token}`)
					.expect(200)
					.expect('Content-Type', /application\/json/);

				assert.strictEqual(
					response.body.length,
					helper.demoTransactions.length,
				);

				response.body.forEach((t) =>
					assert.strictEqual(t.user.toString(), userId),
				);
			});

			test('fails with 401 if no token is provided', async () => {
				await api.get('/api/transactions').expect(401);
			});
		});

		describe('GET /api/transactions/:id', () => {
			let transactionTofind;

			beforeEach(async () => {
				const transactions = await helper.transactionsInDb();
				transactionTofind = transactions.find(
					(t) => t.user.toString() === userId,
				);
				if (!transactionTofind) {
					throw new Error('Could not find User transaction to update');
				}
			});

			test('gets the transaction successfully', async () => {
				const response = await api
					.get(`/api/transactions/${transactionTofind.id}`)
					.set('Authorization', `Bearer ${token}`)
					.expect(200)
					.expect('Content-Type', /application\/json/);

				assert.strictEqual(response.body.amount, transactionTofind.amount);
			});

			test('fails with 401 if no token is provided', async () => {
				await api.get(`/api/transactions/${transactionTofind.id}`).expect(401);
			});

			test("fails with 403 if trying to access another user's transaction", async () => {
				await api
					.get(`/api/transactions/${transactionOfUserB._id}`)
					.set('Authorization', `Bearer ${token}`)
					.expect(403);
			});

			test('fails with 404 for a non-existent ID', async () => {
				const nonExistentId = await helper.nonExisitingId();

				await api
					.get(`/api/transactions/${nonExistentId}`)
					.set('Authorization', `Bearer ${token}`)
					.expect(404);
			});

			test('fails with 400 for a malformed ID', async () => {
				const malformedId = '12345';
				await api
					.get(`/api/transactions/${malformedId}`)
					.set('Authorization', `Bearer ${token}`)
					.expect(400);
			});
		});

		describe('PUT /api/transactions/:id', () => {
			let transactionToUpdate;

			beforeEach(async () => {
				const transactions = await helper.transactionsInDb();
				transactionToUpdate = transactions.find(
					(t) => t.user.toString() === userId,
				);
				if (!transactionToUpdate) {
					throw new Error('Could not find User transaction to update');
				}
			});

			test('should update the transaction successfully with valid data', async () => {
				const updateData = {
					title: transactionToUpdate.title,
					amount: 123.45,
					currency: 'INR',
					type: transactionToUpdate.type,
					category: transactionToUpdate.category.toString(),
					description: 'Updated Description',
					tags: ['updated', 'test'],
					date: transactionToUpdate.date,
				};

				const response = await api
					.put(`/api/transactions/${transactionToUpdate.id}`)
					.set('Authorization', `Bearer ${token}`)
					.send(updateData)
					.expect(200)
					.expect('Content-Type', /application\/json/);

				assert.strictEqual(response.body.amount, updateData.amount);
				assert.strictEqual(response.body.description, updateData.description);
				assert.deepStrictEqual(response.body.tags, updateData.tags);

				const updatedTransaction = await Transaction.findById(
					transactionToUpdate.id,
				);
				assert.strictEqual(updatedTransaction.amount, updateData.amount);
				assert.strictEqual(
					updatedTransaction.description,
					updateData.description,
				);
				assert.deepStrictEqual(updatedTransaction.tags, updateData.tags);
			});

			test('fails with no data', async () => {
				const response = await api
					.put(`/api/transactions/${transactionToUpdate.id}`)
					.set('Authorization', `Bearer ${token}`)
					.send({})
					.expect(400);
			});

			test('fails with 401 if no token is provided', async () => {
				const updateData = {
					amount: 123.45,
					currency: 'INR',
					description: 'Updated Description',
					tags: ['updated', 'test'],
				};

				await api
					.put(`/api/transactions/${transactionToUpdate.id}`)
					.send(updateData)
					.expect(401);
			});

			test("fails with 403 if trying to update another user's transaction", async () => {
				const initialAmount = transactionOfUserB.amount;
				await api
					.put(`/api/transactions/${transactionOfUserB._id}`)
					.set('Authorization', `Bearer ${token}`)
					.send({ amount: 111 })
					.expect(403);

				const transactionAfterUpdate = await Transaction.findById(
					transactionOfUserB._id,
				);

				assert.strictEqual(initialAmount, transactionAfterUpdate.amount);
			});

			test('fails with 404 for a non-existent ID', async () => {
				const nonExistentId = await helper.nonExisitingId();

				await api
					.get(`/api/transactions/${nonExistentId}`)
					.set('Authorization', `Bearer ${token}`)
					.send({ amount: 50 })
					.expect(404);
			});

			test('fails with 400 if validation fails (e.g., invalid amount)', async () => {
				const invalidUpdateData = {
					amount: 'not-a-number',
				};
				const response = await api
					.put(`/api/transactions/${transactionToUpdate.id}`)
					.set('Authorization', `Bearer ${token}`)
					.send(invalidUpdateData)
					.expect(400);

				assert.strictEqual(response.body.error, 'Amount must be a number');
			});

			test('fails with 400 for a malformed ID', async () => {
				const malformedId = '12345';
				await api
					.put(`/api/transactions/${malformedId}`)
					.set('Authorization', `Bearer ${token}`)
					.send({ amount: 50 })
					.expect(400);
			});
		});

		describe('DELETE /api/transactions/:id', () => {
			test('successfully deletes the transaction with the given id', async () => {
				const transactionsAtStart = await helper.transactionsInDb();

				const transactionToDelete = transactionsAtStart.find(
					(t) => t.user.toString() === userId,
				);

				if (!transactionToDelete) {
					throw new Error(
						'Could not find a transaction belonging to the primary test user in the initial data',
					);
				}

				await api
					.delete(`/api/transactions/${transactionToDelete.id}`)
					.set('Authorization', `Bearer ${token}`)
					.expect(204);

				const transactionsAtEnd = await helper.transactionsInDb();

				assert.strictEqual(
					transactionsAtStart.length - 1,
					transactionsAtEnd.length,
				);
				const ids = transactionsAtEnd.map((n) => n.id);

				assert(!ids.includes(transactionToDelete.id));
			});

			test('fails with 401 if no token is provided', async () => {
				const transactionsAtStart = await helper.transactionsInDb();
				const transactionToDelete = transactionsAtStart.find(
					(t) => t.user.toString() === userId,
				);

				await api
					.delete(`/api/transactions/${transactionToDelete.id}`)
					.expect(401);

				const transactionAtEnd = await helper.transactionsInDb();

				assert.strictEqual(transactionsAtStart.length, transactionAtEnd.length);
			});

			test('fails with 403 if transaction id is of another user', async () => {
				const transactionsAtStart = await helper.transactionsInDb();

				await api
					.delete(`/api/transactions/${transactionOfUserB._id}`)
					.set('Authorization', `Bearer ${token}`)
					.expect(403);

				const transactionAtEnd = await helper.transactionsInDb();

				assert.strictEqual(transactionsAtStart.length, transactionAtEnd.length);
			});

			test('fails with 400 for a malformed ID', async () => {
				const malformedId = '12345';
				await api
					.delete(`/api/transactions/${malformedId}`)
					.set('Authorization', `Bearer ${token}`)
					.send({ amount: 50 })
					.expect(400);
			});
		});
	});
});

after(async () => {
	await mongoose.connection.close();
});
