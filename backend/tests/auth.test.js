import assert from 'node:assert';
import bcrypt from 'bcrypt';
import { test, after, beforeEach, describe } from 'node:test';
import mongoose from 'mongoose';
import supertest from 'supertest';
import User from '../models/user.js';
import helper from './test_helper.js';
import app from '../app.js';

const api = supertest(app);

describe('Authentication API - Happy Path', () => {
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

	test('registration succeeds with a fresh email', async () => {
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
		assert.strictEqual(usersAtEnd.length, 2);
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
});

after(async () => {
	await mongoose.connection.close();
});
