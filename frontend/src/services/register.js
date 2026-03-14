import axios from 'axios';

const baseUrl = '/api/register';

const register = async (newUserData) => {
	// newUserData = { name: 'Anas Ahmad', email: 'anasahmad@test.com', password: 'password123' }
	const response = await axios.post(baseUrl, newUserData);
	return response.data;
};

export default { register };
