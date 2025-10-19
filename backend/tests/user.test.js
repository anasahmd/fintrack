// const assert = require('node:assert');
// const bcrypt = require('bcrypt');
// const { test, after, beforeEach, describe } = require('node:test');
// const mongoose = require('mongoose');
// const supertest = require('supertest');
// const User = require('../models/user');
// const helper = require('./test_helper');
// const app = require('../app');

// const api = supertest(app);

// describe('when there is initially one user at db', () => {
// 	beforeEach(async () => {
// 		await User.deleteMany({});
// 		const passwordHash = await bcrypt.hash('sekret', 10);
// 		const user = new User({
// 			name: 'Admin',
// 			email: 'admin@gmail.com',
// 			passwordHash,
// 		});

// 		await user.save();
// 	});

// 	test('creation succeeds with a fresh email', async () => {
// 		const usersAtStart = await helper.usersInDb();

// 		const newUser = {
// 			name: 'Anas Ahmad',
// 			email: 'anasahmad0239@gmail.com',
// 			password: 'canttellyou',
// 		};

// 		await api
// 			.post('/api/users')
// 			.send(newUser)
// 			.expect(201)
// 			.expect('Content-Type', /application\/json/);

// 		const usersAtEnd = await helper.usersInDb();
// 		assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

// 		const emails = usersAtEnd.map((u) => u.email);
// 		assert(emails.includes(newUser.email));
// 	});
// });

// after(async () => {
// 	await mongoose.connection.close();
// });
