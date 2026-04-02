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

const edit = async (id, payload) => {
	const response = await api.put(`${endpoint}/${id}`, payload);
	return response.data;
};

export default { create, edit, getAll };
