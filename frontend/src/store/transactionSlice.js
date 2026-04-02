import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import transactionService from '@/services/transactions';

export const fetchTransactions = createAsyncThunk(
	'transactions/fetchAll',
	async () => {
		return await transactionService.getAllTransactions();
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
			})
			.addCase(deleteTransaction.fulfilled, (state, action) => {
				state.items = state.items.filter((item) => item.id !== action.payload);
			});
	},
});

export default transactionSlice.reducer;
