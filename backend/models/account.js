const mongoose = require('mongoose');
const {
	SUPPORTED_ACCOUNT_TYPES,
	SUPPORTED_CURRENCIES,
} = require('../utils/constants');

const accountSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		name: { type: String, required: true, trim: true },
		type: {
			type: String,
			enum: SUPPORTED_ACCOUNT_TYPES,
			required: true,
		},
		currency: { type: String, required: true, enum: SUPPORTED_CURRENCIES },
		balance: { type: Number, default: 0 },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

accountSchema.index(
	{ user: 1, name: 1 },
	{ unique: true, collation: { locale: 'en', strength: 2 } },
);

accountSchema.set('toJSON', {
	transform: (document, returnedObject) => {

		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Account', accountSchema);
