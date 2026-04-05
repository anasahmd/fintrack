import { logout } from '@/store/authSlice';
import { ExternalLink, Wallet } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const Header = () => {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);

	const handleLogout = () => {
		dispatch(logout());
	};

	return (
		<header
			className={cn(
				'bg-background z-10 w-full mx-auto h-12 py-10 flex items-center justify-between border-b',
				user ? 'max-w-7xl' : 'max-w-xl',
			)}
		>
			<div className="flex items-center gap-2">
				<Wallet />
				<div className="text-xl font-bold text-primary">Fintrack</div>
			</div>

			{user ? (
				<div className="flex items-center gap-4">
					<Button
						variant="outline"
						size="sm"
						className="cursor-pointer"
						onClick={handleLogout}
					>
						Log out
					</Button>
				</div>
			) : (
				<a
					href="https://anasahmad.dev"
					target="_blank"
					rel="noopener noreferrer"
					className="group flex items-center gap-1 text-base font-medium text-muted-foreground transition-colors hover:text-primary"
				>
					<span>Built by Anas</span>
					<ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
				</a>
			)}
		</header>
	);
};

export default Header;
