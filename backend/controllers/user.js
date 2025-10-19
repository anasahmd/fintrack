const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/user');
const logger = require('../utils/logger');

userRouter.get('/', (request, response) => {
	response.send('Hey');
});

userRouter.post('/', async (request, response) => {
	const { name, email, password } = request.body;

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);

	const newUser = new User({
		name,
		email,
		passwordHash,
	});

	try {
		const savedUser = await newUser.save();
		response.status(201).json(savedUser);
	} catch (e) {
		next(e);
	}
});

module.exports = userRouter;
