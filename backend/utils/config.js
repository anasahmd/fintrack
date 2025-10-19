const logger = require('../utils/logger');

require('dotenv').config();

const PORT = process.env.PORT;

const MONGODB_URI =
	process.env.NODE_ENV === 'test'
		? process.env.TEST_MONGODB_URI
		: process.env.MONGODB_URI;

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV !== 'test') {
	logger.error('FATAL ERROR: JWT_SECRET is not defined.');
	process.exit(1);
}

module.exports = { MONGODB_URI, PORT, JWT_SECRET };
