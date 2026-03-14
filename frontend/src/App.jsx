import { useEffect, useState } from 'react';
import './App.css';
import Login from './pages/Login';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	Navigate,
} from 'react-router-dom';
import transactionService from './services/transactions';
import Dashboard from './pages/Dashboard';

function App() {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedInUser');
		if (loggedUserJSON) {
			const parsedUser = JSON.parse(loggedUserJSON);
			setUser(parsedUser);
			transactionService.setToken(parsedUser.token);
		}
	}, []);

	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={user ? <Dashboard /> : <Navigate to="/login" />}
				/>
				<Route
					path="/login"
					element={
						user ? <Navigate to="/" replace /> : <Login setUser={setUser} />
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
