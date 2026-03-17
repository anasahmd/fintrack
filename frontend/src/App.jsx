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
import { toast, Toaster } from 'sonner';
import Layout from './components/Layout';

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

	const handleLogout = () => {
		window.localStorage.removeItem('loggedInUser');

		transactionService.setToken(null);

		setUser(null);
		toast.success("You've been logged out");
	};

	return (
		<div>
			<Toaster position="bottom-center" />
			<Router>
				<Routes>
					<Route
						path="/"
						element={
							user ? (
								<Layout user={user} handleLogout={handleLogout} />
							) : (
								<Navigate to="/login" />
							)
						}
					>
						<Route path="/" element={<Dashboard user={user} />} />
					</Route>

					<Route
						path="/login"
						element={
							user ? <Navigate to="/" replace /> : <Login setUser={setUser} />
						}
					/>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
