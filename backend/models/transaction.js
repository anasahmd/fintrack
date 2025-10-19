const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		description: {
			type: String,
			trim: true,
			default: '',
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
			type: String,
			trim: true,
			required: [true, 'Category is required'],
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
	{ timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
