import { api } from './api';

const endpoint = '/categories';

const getAll = async () => {
	const response = await api.get(endpoint);

	return response.data;
};

export default { getAll };
