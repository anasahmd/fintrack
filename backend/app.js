const express = require('express');
const mongoose = require('mongoose');
const config = require('./utils/config');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const userRouter = require('./controllers/user');
const authRouter = require('./controllers/auth');

const app = express();

logger.info('connecting to mongodb');
mongoose
	.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('connected to mongodb');
	})
	.catch((error) => {
		logger.error('error connecting to mongodb', error.message);
	});

app.use(express.json());
app.use(middleware.requestLogger);

app.get('/', (req, res) => {
	res.send('Hello world');
});

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
