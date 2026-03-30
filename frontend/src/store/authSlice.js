import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '@/services/auth';
import { setGlobalToken } from '@/services/api';

const savedUser = JSON.parse(localStorage.getItem('user'));

if (savedUser && savedUser.token) {
	setGlobalToken(savedUser.token);
}

export const loginUser = createAsyncThunk(
	'auth/login',
	async (credentials, { rejectWithValue }) => {
		try {
			return await authService.login(credentials);
		} catch (error) {
			const errorMessage =
				error.response?.data?.message ||
				error.response?.data?.error ||
				'Login failed. Please check your credentials and try again.';
			return rejectWithValue(errorMessage);
		}
	},
);

export const registerUser = createAsyncThunk(
	'auth/register',
	async (userData, { rejectWithValue }) => {
		try {
			return await authService.register(userData);
		} catch (error) {
			const errorMessage =
				error.response?.data?.message ||
				error.response?.data?.error ||
				'Registration failed. Please try again.';

			return rejectWithValue(errorMessage);
		}
	},
);

const authSlice = createSlice({
	name: 'auth',

	initialState: {
		user: savedUser ? savedUser : null,
	},

	reducers: {
		logout: (state) => {
			localStorage.removeItem('user');
			state.user = null;
			setGlobalToken(null);
		},
	},

	extraReducers: (builder) => {
		builder
			.addCase(loginUser.fulfilled, (state, action) => {
				state.user = action.payload;
				localStorage.setItem('user', JSON.stringify(action.payload));
				setGlobalToken(action.payload.token);
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.user = action.payload;
				localStorage.setItem('user', JSON.stringify(action.payload));
				setGlobalToken(action.payload.token);
			});
	},
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
