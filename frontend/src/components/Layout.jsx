import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = ({ children }) => {
	return (
		<div className="min-h-screen flex flex-col px-6 sm:px-12">
			<div className="">
				<Header />
			</div>
			<main className="w-full max-w-7xl mx-auto">{children}</main>
		</div>
	);
};

export default Layout;
