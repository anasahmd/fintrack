import { api } from './api';

const endpoint = '/transactions';

const getAllTransactions = async () => {
	const response = await api.get(endpoint);
	return response.data;
};

const createTransaction = async (payload) => {
	const response = await api.post(endpoint, payload);
	return response.data;
};

const editTransaction = async (id, payload) => {
	const response = await api.put(`${endpoint}/${id}`, payload);
	return response.data;
};

const deleteTransaction = async (id) => {
	await api.delete(`${endpoint}/${id}`);
	return id;
};

export default {
	createTransaction,
	editTransaction,
	deleteTransaction,
	getAllTransactions,
};
