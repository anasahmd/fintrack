const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/user');
const logger = require('../utils/logger');

userRouter.get('/', (request, response) => {
	response.send('Hey');
});

module.exports = userRouter;
