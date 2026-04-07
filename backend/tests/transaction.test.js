describe('POST /api/transactions', () => {
	const validTransaction = {
		amount: 10,
		type: 'Expense',
		category: testCategoryId,
		currency: 'INR',
		description: 'Chai',
		tags: ['chai'],
		date: new Date('2025-10-01T10:00:00Z'),
	};

	test('creates a new transaction successfully', async () => {
		await api
			.post('/api/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(validTransaction)
			.expect(201);
	});

	test('fails with 401 authorized if token is not provided', async () => {
		await api.post('/api/transactions').send(validTransaction).expect(401);
	});

	describe('Validation rules', () => {
		const badPayloads = [
			{
				desc: 'amount is missing',
				override: { amount: undefined },
				expectedError: 'Amount is required',
			},
			{
				desc: 'amount is not a number',
				override: { amount: 'ten' },
				expectedError: 'Amount must be a number',
			},
			{
				desc: 'type is invalid',
				override: { type: 'Magic' },
				expectedError: 'Type must be either "Income" or "Expense"',
			},
			{
				desc: 'title is too long',
				override: { title: 'a'.repeat(31) },
				expectedError: 'Title cannot be longer than 30 characters',
			},
			{
				desc: 'too many tags',
				override: { tags: new Array(11).fill('tag') },
				expectedError: 'You can add a maximum of 10 tags',
			},
			{
				desc: 'invalid date format',
				override: { date: 'fake date' },
				expectedError: 'Date must be a valid date format',
			},
		];

		for (const { desc, override, expectedError } of badPayloads) {
			test(`fails when ${desc}`, async () => {
				const badTransaction = { ...validTransaction, ...override };

				const response = await api
					.post('/api/transactions')
					.set('Authorization', `Bearer ${token}`)
					.send(badTransaction)
					.expect(400);

				assert.strictEqual(response.body.error, expectedError);
			});
		}
	});
});
