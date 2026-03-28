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
				state.items.unshift(action.payload);
			});
	},
});

export default transactionSlice.reducer;
