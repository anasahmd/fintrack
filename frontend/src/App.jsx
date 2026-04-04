import './App.css';
import Login from './pages/Login';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	Navigate,
} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import { useSelector } from 'react-redux';
import Register from './pages/Register';

function App() {
	const { user } = useSelector((state) => state.auth);

	return (
		<div>
			<Toaster position="bottom-center" />
			<Router>
				<Layout>
					<Routes>
						<Route
							path="/"
							element={user ? <Dashboard /> : <Navigate to="/login" />}
						/>

						<Route
							path="/login"
							element={user ? <Navigate to="/" replace /> : <Login />}
						/>

						<Route
							path="/register"
							element={user ? <Navigate to="/" replace /> : <Register />}
						/>
					</Routes>
				</Layout>
			</Router>
		</div>
	);
}

export default App;
