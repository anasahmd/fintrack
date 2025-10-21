const bcrypt = require('bcrypt');
const authRouter = require('express').Router();
const User = require('../models/user');
const config = require('../utils/config');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../validations/auth');

authRouter.post('/register', async (request, response, next) => {
	try {
		const { name, email, password } = request.body;

		try {
			await registerSchema.validateAsync({ name, email, password });
		} catch (e) {
			return response.status(400).json({ error: e.details[0].message });
		}

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return response
				.status(400)
				.json({ error: 'An account with this email already exists' });
		}

		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(password, saltRounds);

		const newUser = new User({
			name,
			email,
			passwordHash,
		});

		try {
			const savedUser = await newUser.save();
			response.status(201).json({
				id: savedUser._id,
				name: savedUser.name,
				email: savedUser.email,
			});
		} catch (e) {
			next(e);
		}
	} catch (e) {
		next(e);
	}
});

authRouter.post('/login', async (request, response, next) => {
	try {
		const { email, password } = request.body;

		try {
			await loginSchema.validateAsync({ email, password });
		} catch (e) {
			return response.status(400).json({ error: e.details[0].message });
		}

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
	} catch (e) {
		next(e);
	}
});

module.exports = authRouter;
