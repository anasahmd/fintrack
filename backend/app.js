import express from 'express';
import mongoose from 'mongoose';
import * as config from './utils/config.js';
import middleware from './middlewares/common.js';
import logger from './utils/logger.js';
// import userRouter from './controllers/user.js';
import authRouter from './routes/auth.js';
import transactionRouter from './routes/transaction.js';
import categoryRouter from './routes/category.js';
import accountRouter from './routes/account.js';
import userExtractor from './middlewares/userExtractor.js';

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

// app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/transactions', userExtractor, transactionRouter);
app.use('/api/categories', userExtractor, categoryRouter);
app.use('/api/accounts', userExtractor, accountRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
