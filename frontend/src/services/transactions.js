import { api } from './api';

const endpoint = '/transactions';

export const getAllTransactions = async ({ from, to }) => {
	const response = await api.get(endpoint);
	const allTransactions = response.data;

	const fromDate = new Date(from);

	const toDate = new Date(to);
	toDate.setHours(23, 59, 59, 999);

	const startingBalance = allTransactions.reduce((acc, transaction) => {
		const transactionDate = new Date(transaction.date);

		if (transactionDate < fromDate) {
			return (
				acc +
				(transaction.type === 'Income'
					? transaction.amount
					: -transaction.amount)
			);
		}
		return acc;
	}, 0);

	const rangeTransactions = allTransactions.filter((transaction) => {
		const transactionDate = new Date(transaction.date);

		return transactionDate >= fromDate && transactionDate <= toDate;
	});

	return {
		transactions: rangeTransactions,
		startingBalance: startingBalance,
	};
};

const createTransaction = async (payload) => {
	console.log(payload);

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
