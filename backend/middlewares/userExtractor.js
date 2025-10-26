const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const User = require('../models/user');
const logger = require('../utils/logger');

const userExtractor = async (request, response, next) => {
	const authorization = request.get('authorization');

	let token = null;
	if (authorization && authorization.startsWith('Bearer ')) {
		token = authorization.replace('Bearer ', '');
	}

	if (!token) {
		return response.status(401).json({ error: 'token missing or invalid' });
	}

	try {
		const decodedToken = jwt.verify(token, JWT_SECRET);

		if (!decodedToken.id) {
			return response.status(401).json({ error: 'token invalid' });
		}

		const user = await User.findById(decodedToken.id);

		if (!user) {
			return response
				.status(401)
				.json({ error: 'no user found for the token' });
		}

		request.user = user;

		next();
	} catch (e) {
		logger.error('Authentication error: ', e);
		next(e);
	}
};

module.exports = userExtractor;
