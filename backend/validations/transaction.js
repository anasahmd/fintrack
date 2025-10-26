const Joi = require('joi');

// Schema for validating the request body when creating and updating a transaction

const transactionSchema = Joi.object({
	amount: Joi.number().required().messages({
		'number.base': 'Amount must be a number',
		'any.required': 'Amount is required',
	}),

	type: Joi.string().valid('Income', 'Expense').required().messages({
		'any.only': 'Type must be either "Income" or "Expense"',
		'any.required': 'Type is required',
	}),

	category: Joi.string().min(1).required().messages({
		'string.empty': 'Category cannot be empty',
		'any.required': 'Category is required',
	}),

	description: Joi.string()
		.allow('') // Allow empty string
		.max(250)
		.optional()
		.messages({
			'string.max': 'Description cannot be longer than 250 characters',
		}),

	tags: Joi.array()
		.items(
			Joi.string()
				.min(1) // Prevent empty tags like ""
				.max(30) // Max 30 chars per tag
				.messages({
					'string.empty': 'Tags cannot be empty',
					'string.max': 'Each tag cannot be longer than 30 characters',
				})
		)
		.max(10) // Allow a maximum of 10 tags per transaction
		.optional()
		.default([])
		.messages({
			'array.max': 'You can add a maximum of 10 tags',
		}),

	date: Joi.date().optional().messages({
		'date.base': 'Date must be a valid date format',
	}),
});

const updateTransactionSchema = Joi.object({
	amount: Joi.number()
		.optional()
		.messages({ 'number.base': 'Amount must be a number' }),
	type: Joi.string()
		.valid('Income', 'Expense')
		.optional()
		.messages({ 'any.only': 'Type must be either "Income" or "Expense"' }),
	category: Joi.string()
		.optional()
		.messages({ 'string.empty': 'Category cannot be empty' }),
	description: Joi.string().allow('').max(250).optional().messages({
		'string.max': 'Description cannot be longer than 250 characters',
	}),
	tags: Joi.array()
		.items(Joi.string().min(1).max(30))
		.max(10)
		.optional()
		.messages({
			'array.max': 'You can add a maximum of 10 tags',
		}),
	date: Joi.date().optional().messages({
		'date.base': 'Date must be a valid date format',
	}),
})
	.min(1)
	.messages({
		'object.min': 'At least one field must be provided for update',
	});

module.exports = {
	transactionSchema,
	updateTransactionSchema,
};
