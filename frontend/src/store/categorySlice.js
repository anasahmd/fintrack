import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryService from '@/services/categories';

export const fetchCategories = createAsyncThunk(
	'categories/fetchAll',
	async () => {
		return await categoryService.getAll();
	},
);

const categorySlice = createSlice({
	name: 'categories',
	initialState: {
		items: [],
	},
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchCategories.fulfilled, (state, action) => {
			state.items = action.payload;
		});
	},
});

export default categorySlice.reducer;
