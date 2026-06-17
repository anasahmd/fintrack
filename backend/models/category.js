import mongoose from 'mongoose';
import { CATEGORY_COLORS } from '../utils/constants.js';

const categorySchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		type: {
			type: String,
			enum: ['Income', 'Expense'],
			required: true,
		},
		emoji: {
			type: String,
			required: true,
		},
		color: {
			type: String,
			required: true,
			enum: CATEGORY_COLORS,
		},
	},
	{ timestamps: true },
);

categorySchema.index(
	{ user: 1, name: 1, type: 1 },
	{ unique: true, collation: { locale: 'en', strength: 2 } },
);

categorySchema.set('toJSON', {
	transform: (document, returnedObject) => {

		delete returnedObject.__v;
	},
});

export default mongoose.model('Category', categorySchema);
