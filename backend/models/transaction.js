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
			maxlength: [30, 'Title cannot exceed 30 characters'],
		},
		description: {
			type: String,
			trim: true,
			default: '',
			maxlength: [250, 'Description cannot exceed 250 characters'],
		},
		amount: {
			type: Number,
			required: [true, 'Amount is required'],
		},
		type: {
			type: String,
			enum: ['Income', 'Expense'],
			required: [true, 'Type is required'],
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
			required: [true, 'Category is required'],
		},
		currency: {
			type: String,
			required: true,
			enum: SUPPORTED_CURRENCIES,
			default: 'INR',
		},
		tags: {
			type: [String],
			default: [],
		},
		date: {
			type: Date,
			required: [true, 'Date is required'],
			default: Date.now(),
		},
	},
	{ timestamps: true },
);

transactionSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Transaction', transactionSchema);
