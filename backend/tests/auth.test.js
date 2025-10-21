const assert = require('node:assert');
const bcrypt = require('bcrypt');
const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const User = require('../models/user');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

describe('registration test with one user in db', () => {
	beforeEach(async () => {
		await User.deleteMany({});
		const passwordHash = await bcrypt.hash('sekret', 10);
		const user = new User({
			name: 'Admin',
			email: 'admin@gmail.com',
			passwordHash,
		});

		await user.save();
	});

	test('creation succeeds with a fresh email', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			name: 'Anas Ahmad',
			email: 'anasahmad0239@gmail.com',
			password: 'canttellyou',
		};

		await api
			.post('/api/auth/register')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await helper.usersInDb();

		assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

		const emails = usersAtEnd.map((u) => u.email);
		assert(emails.includes(newUser.email));
	});

	test('creation fails with a duplicate email', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			name: 'Admin',
			email: 'admin@gmail.com',
			password: 'secret',
		};

		const response = await api
			.post('/api/auth/register')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		assert.strictEqual(
			response.body.error,
			'An account with this email already exists'
		);

		const usersAtEnd = await helper.usersInDb();

		assert.strictEqual(usersAtEnd.length, usersAtStart.length);
	});

	test('Creation fails if email is missing', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			name: 'Bad Email',
			password: 'secret',
		};

		const response = await api
			.post('/api/auth/register')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		assert.strictEqual(response.body.error, 'Email is required');

		const usersAtEnd = await helper.usersInDb();

		assert.strictEqual(usersAtEnd.length, usersAtStart.length);
	});

	test('creation fails if email is not valid', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			name: 'Bad Email',
			email: 'bademailcom',
			password: 'secret',
		};

		const response = await api
			.post('/api/auth/register')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		assert.strictEqual(
			response.body.error,
			'Please enter a valid email address'
		);

		const usersAtEnd = await helper.usersInDb();

		assert.strictEqual(usersAtEnd.length, usersAtStart.length);
	});

	test('creation fails if password is missing', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			name: 'Bad Email',
			email: 'email@test.com',
		};

		const response = await api
			.post('/api/auth/register')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		assert.strictEqual(response.body.error, 'Password is required');

		const usersAtEnd = await helper.usersInDb();

		assert.strictEqual(usersAtEnd.length, usersAtStart.length);
	});

	test('creation fails if password is less than 6 characters', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			name: 'Bad Password',
			email: 'emai@test.com',
			password: 'ab',
		};

		const response = await api
			.post('/api/auth/register')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		assert.strictEqual(
			response.body.error,
			'Password must be at least 6 characters long'
		);

		const usersAtEnd = await helper.usersInDb();

		assert.strictEqual(usersAtEnd.length, usersAtStart.length);
	});

	test('creation fails if name is missing', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			email: 'email@test.com',
			password: 'secret',
		};

		const response = await api
			.post('/api/auth/register')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		assert.strictEqual(response.body.error, 'Name is required');

		const usersAtEnd = await helper.usersInDb();

		assert.strictEqual(usersAtEnd.length, usersAtStart.length);
	});

	test('Creation fails if name is less than 2 characters', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			name: 'A',
			email: 'email@test.com',
			password: 'secret',
		};

		const response = await api
			.post('/api/auth/register')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		assert.strictEqual(
			response.body.error,
			'Name must be at least 2 characters long'
		);

		const usersAtEnd = await helper.usersInDb();

		assert.strictEqual(usersAtEnd.length, usersAtStart.length);
	});
});

describe('login test', () => {
	beforeEach(async () => {
		await User.deleteMany({});
		const passwordHash = await bcrypt.hash('sekret', 10);
		const user = new User({
			name: 'Admin',
			email: 'admin@gmail.com',
			passwordHash,
		});

		await user.save();
	});

	test('login successful with correct credentials', async () => {
		const loginInfo = {
			email: 'admin@gmail.com',
			password: 'sekret',
		};

		const response = await api
			.post('/api/auth/login')
			.send(loginInfo)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		assert(response.body.token);
	});

	test('fails with wrong password', async () => {
		const loginInfo = {
			email: 'admin@gmail.com',
			password: 'wrongpassword',
		};

		const response = await api
			.post('/api/auth/login')
			.send(loginInfo)
			.expect(401);

		assert.strictEqual(response.body.error, 'Invalid email or password');
	});

	test('fails if email field is empty', async () => {
		const loginInfo = {
			password: 'wrongpassword',
		};

		const response = await api
			.post('/api/auth/login')
			.send(loginInfo)
			.expect(400);

		assert.strictEqual(response.body.error, 'Email is required');
	});

	test('fails if email is invalid', async () => {
		const loginInfo = {
			email: 'bademail',
			password: 'wrongpassword',
		};

		const response = await api
			.post('/api/auth/login')
			.send(loginInfo)
			.expect(400);

		assert.strictEqual(
			response.body.error,
			'Please enter a valid email address'
		);
	});

	test('fails if password field is empty', async () => {
		const loginInfo = {
			email: 'admin@gmail.com',
		};

		const response = await api
			.post('/api/auth/login')
			.send(loginInfo)
			.expect(400);

		assert.strictEqual(response.body.error, 'Password is required');
	});
});

after(async () => {
	await mongoose.connection.close();
});
