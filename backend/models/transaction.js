const mongoose = require('mongoose');
const { SUPPORTED_CURRENCIES } = require('../utils/constants');

const transactionSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		title: {
			type: String,
			trim: true,
			default: '',
			maxlength: 30,
		},
		description: {
			type: String,
			trim: true,
			default: '',
			maxlength: 250,
		},
		amount: {
			type: Number,
			required: true,
			min: 1,
			max: 1000000000,
		},
		account: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account',
			required: true,
		},
		type: {
			type: String,
			enum: ['Income', 'Expense'],
			required: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
		currency: {
			type: String,
			required: true,
			enum: SUPPORTED_CURRENCIES,
		},
		tags: {
			type: [String],
			default: [],
		},
		date: {
			type: Date,
			required: true,
			default: Date.now(),
		},
	},
	{ timestamps: true },
);

transactionSchema.set('toJSON', {
	transform: (document, returnedObject) => {

		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Transaction', transactionSchema);
