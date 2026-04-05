import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import transactionService from '@/services/transactions';

export const fetchTransactions = createAsyncThunk(
	'transactions/fetchAll',
	async ({ from, to }) => {
		return await transactionService.getAllTransactions({ from, to });
	},
);

export const addTransaction = createAsyncThunk(
	'transactions/add',
	async (apiPayload) => {
		return await transactionService.createTransaction(apiPayload);
	},
);

export const editTransaction = createAsyncThunk(
	'transactions/edit',
	async ({ id, apiPayload }) => {
		return await transactionService.editTransaction(id, apiPayload);
	},
);

export const deleteTransaction = createAsyncThunk(
	'transactions/delete',
	async (id) => {
		return await transactionService.deleteTransaction(id);
	},
);

export const transactionSlice = createSlice({
	name: 'transactions',

	initialState: {
		items: [],
		startingBalance: 0,
		isLoading: true,
		error: null,
	},

	reducers: {},

	extraReducers: (builder) => {
		builder
			.addCase(fetchTransactions.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchTransactions.fulfilled, (state, action) => {
				state.isLoading = false;
				state.items = action.payload.transactions;
				state.startingBalance = action.payload.startingBalance;
			})
			.addCase(fetchTransactions.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message;
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
			})
			.addCase(deleteTransaction.fulfilled, (state, action) => {
				state.items = state.items.filter((item) => item.id !== action.payload);
			});
	},
});

export default transactionSlice.reducer;
