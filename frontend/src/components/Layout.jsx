import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = ({ children }) => {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
				{children}
			</main>
		</div>
	);
};

export default Layout;
