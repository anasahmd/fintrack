const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		currency: {
			type: String,
			required: true,
			default: 'INR',
			enum: ['INR', 'USD', 'EUR', 'GBP'],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
