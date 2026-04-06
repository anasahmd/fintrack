const accountSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	name: { type: String, required: true }, // e.g., "HDFC Bank", "SBI Credit"
	type: {
		type: String,
		enum: ['Bank', 'Cash', 'Credit Card', 'Loan'],
		required: true,
	},
	currency: { type: String, required: true },
	balance: { type: Number, default: 0 },
});
