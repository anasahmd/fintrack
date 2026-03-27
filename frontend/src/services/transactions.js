import { api } from './api';

const endpoint = '/transactions';

const getAll = async () => {
	const response = await api.get(endpoint);
	return response.data;
};

const create = async (payload) => {
	const response = await api.post(endpoint, payload);
	return response.data;
};

export default { create, getAll };
