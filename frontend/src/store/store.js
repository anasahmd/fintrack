import { configureStore } from '@reduxjs/toolkit';

import transactionReducer from './transactionSlice';
import categoryReducer from './categorySlice';
import authReducer from './authSlice';

export const store = configureStore({
	reducer: {
		transactions: transactionReducer,
		categories: categoryReducer,
		auth: authReducer,
	},
});
