const bcrypt = require('bcrypt');
const authRouter = require('express').Router();
const User = require('../models/user');
const config = require('../utils/config');
const jwt = require('jsonwebtoken');

authRouter.post('/register', async (request, response, next) => {
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

authRouter.post('/login', async (request, response) => {
	const { email, password } = request.body;

	const user = await User.findOne({ email });

	const passwordCorrect =
		user === null ? false : await bcrypt.compare(password, user.passwordHash);

	if (!(user && passwordCorrect)) {
		return response.status(401).json({ error: 'Invalid email or password' });
	}

	const userForToken = {
		email: user.email,
		id: user._id,
	};

	const token = jwt.sign(userForToken, config.JWT_SECRET);

	response.status(200).send({ token, email: user.email, name: user.name });
});

module.exports = authRouter;
