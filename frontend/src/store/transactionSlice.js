import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import transactionService from '@/services/transactions';

export const fetchTransactions = createAsyncThunk(
	'transactions/fetchAll',
	async () => {
		return await transactionService.getAll();
	},
);

export const addTransaction = createAsyncThunk(
	'transactions/add',
	async (apiPayload) => {
		return await transactionService.create(apiPayload);
	},
);

export const editTransaction = createAsyncThunk(
	'transactions/edit',
	async ({ id, apiPayload }) => {
		return await transactionService.edit(id, apiPayload);
	},
);

export const transactionSlice = createSlice({
	name: 'transactions',

	initialState: {
		items: [],
	},

	reducers: {},

	extraReducers: (builder) => {
		builder
			.addCase(fetchTransactions.fulfilled, (state, action) => {
				state.items = action.payload;
			})
			.addCase(addTransaction.fulfilled, (state, action) => {
				state.items.push(action.payload);
				state.items.sort((a, b) => new Date(b.date) - new Date(a.date));
			})
			.addCase(editTransaction.fulfilled, (state, action) => {
				const index = state.items.findIndex(
					(item) => item.id === action.payload.id,
				);
				if (index !== -1) {
					state.items[index] = action.payload;
					state.items.sort((a, b) => new Date(b.date) - new Date(a.date));
				}
			});
	},
});

export default transactionSlice.reducer;
