import { api } from './api';

const endpoint = '/auth/login';

const login = async (credentials) => {
	const response = await api.post(endpoint, credentials);
	return response.data;
};

export default { login };
