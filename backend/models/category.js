const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'User Id is required'],
		},
		name: {
			type: String,
			required: [true, 'Name is required'],
			trim: true,
		},
		type: {
			type: String,
			enum: ['Income', 'Expense'],
			required: [true, 'Type is required'],
		},
		emoji: {
			type: String,
			default: '🏷️',
		},
	},
	{ timestamps: true },
);

categorySchema.index({ user: 1, name: 1, type: 1 }, { unique: true });

categorySchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Category', categorySchema);
