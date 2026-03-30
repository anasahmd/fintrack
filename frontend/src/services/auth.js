import { api } from './api';

const endpoint = '/auth';

const login = async (credentials) => {
	const response = await api.post(endpoint + '/login', credentials);
	return response.data;
};

const register = async (newUserData) => {
	// newUserData = { name: 'Anas Ahmad', email: 'anasahmad@test.com', password: 'password123' }
	const response = await api.post(endpoint + '/register', newUserData);
	return response.data;
};

export default { login, register };
