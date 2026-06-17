import Joi from 'joi';
import {
	SUPPORTED_ACCOUNT_TYPES,
	SUPPORTED_CURRENCIES,
} from '../utils/constants.js';

const accountSchema = Joi.object({
	name: Joi.string().trim().min(2).max(50).required().messages({
		'string.empty': 'Name is required',
		'string.min': 'Name must be at least 2 characters long',
		'string.max': 'Name cannot exceed 50 characters',
	}),

	type: Joi.string()
		.valid(...SUPPORTED_ACCOUNT_TYPES)
		.required()
		.messages({
			'any.only': `Type must be one of [${SUPPORTED_ACCOUNT_TYPES.join(', ')}]`,
			'any.required': 'Type is required',
		}),

	currency: Joi.string()
		.uppercase()
		.valid(...SUPPORTED_CURRENCIES)
		.optional()
		.default('INR')
		.messages({
			'any.only': `Currency must be one of [${SUPPORTED_CURRENCIES.join(', ')}]`,
		}),

	balance: Joi.number().optional().default(0).messages({
		'number.base': 'Balance must be a valid number',
	}),
});

const updateAccountSchema = Joi.object({
	name: Joi.string().trim().min(2).max(50).optional(),

	type: Joi.string()
		.valid(...SUPPORTED_ACCOUNT_TYPES)
		.optional(),

	currency: Joi.string()
		.uppercase()
		.valid(...SUPPORTED_CURRENCIES)
		.optional(),

	isActive: Joi.boolean().optional(),

	balance: Joi.forbidden().messages({
		'any.unknown':
			'Security Error: You cannot directly update an account balance. You must log a transaction.',
	}),
});

export {
	accountSchema,
	updateAccountSchema,
};
