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
			lowercase: true,
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

userSchema.set('toJSON', () => {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		// the passwordHash should not be revealed
		delete returnedObject.passwordHash;
	};
});

module.exports = mongoose.model('User', userSchema);
