const Joi = require('joi');

// Schema for validating the request body during user registration.
const registerSchema = Joi.object({
	name: Joi.string().min(2).required().messages({
		'string.min': 'Name must be at least 2 characters long',
		'any.required': 'Name is required',
	}),

	email: Joi.string().email().required().messages({
		'string.email': 'Please enter a valid email address',
		'any.required': 'Email is required',
	}),

	password: Joi.string().min(6).required().messages({
		'string.min': 'Password must be at least 6 characters long',
		'any.required': 'Password is required',
	}),

	// This field is optional. If not provided, Mongoose model's
	// default ('INR') will be used.
	currency: Joi.string().valid('INR', 'USD', 'EUR', 'GBP').optional().messages({
		'any.only': 'Currency must be one of the following: INR, USD, EUR, GBP',
	}),
});

// Schema for validating the request body during user login.

const loginSchema = Joi.object({
	email: Joi.string().email().required().messages({
		'string.email': 'Please enter a valid email',
		'any.required': 'Email is required',
	}),

	password: Joi.string().required().messages({
		'any.required': 'Password is required',
	}),
});

module.exports = {
	registerSchema,
	loginSchema,
};
