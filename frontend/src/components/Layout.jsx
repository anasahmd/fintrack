import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Layout = ({ user, handleLogout }) => {
	return (
		<div className="min-h-screen bg-zinc-50 flex flex-col">
			<header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					<div className="flex items-center gap-8">
						<div className="text-xl font-bold text-primary">FinTrack</div>

						{/* <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-500">
							<div className="text-zinc-900 cursor-pointer">Dashboard</div>
							<div className="hover:text-zinc-900 cursor-pointer">Settings</div>
						</nav> */}
					</div>

					<div className="flex items-center gap-4">
						<span className="text-sm font-medium text-zinc-700 hidden sm:block">
							{user.name}
						</span>
						<Button variant="outline" size="sm" onClick={handleLogout}>
							Log out
						</Button>
					</div>
				</div>
			</header>

			<main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
				<Outlet />
			</main>
		</div>
	);
};

export default Layout;
