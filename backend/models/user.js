import mongoose from 'mongoose';
import { SUPPORTED_CURRENCIES } from '../utils/constants.js';

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		currency: {
			type: String,
			required: true,
			default: 'INR',
			enum: SUPPORTED_CURRENCIES,
		},
		avatarUrl: {
			type: String,
			default: '',
		},
		passwordHash: {
			type: String,
			required: function () {
				return !this.googleId;
			},
		},
		googleId: {
			type: String,
			sparse: true,
			unique: true,
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		verifyEmailToken: String,
		verifyEmailTokenExpires: Date,

		resetPasswordToken: String,
		resetPasswordTokenExpires: Date,

		isActive: {
			type: Boolean,
			default: true,
		},

		isPremium: {
			type: Boolean,
			default: false,
		},
		premiumExpiresAt: Date,
		stripeCustomerId: String,
	},
	{ timestamps: true },
);

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {

		delete returnedObject.__v;
		// the passwordHash should not be revealed
		delete returnedObject.passwordHash;
		delete returnedObject.verifyEmailToken;
		delete returnedObject.verifyEmailTokenExpires;
		delete returnedObject.resetPasswordToken;
		delete returnedObject.resetPasswordTokenExpires;
	},
});

export default mongoose.model('User', userSchema);
