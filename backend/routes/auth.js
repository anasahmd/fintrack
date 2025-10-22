const authController = require('../controllers/auth');
const catchAsync = require('../utils/catchAsync');

const authRouter = require('express').Router();

authRouter.post('/register', catchAsync(authController.register));

authRouter.post('/login', catchAsync(authController.login));

module.exports = authRouter;
