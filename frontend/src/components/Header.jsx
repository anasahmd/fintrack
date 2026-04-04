import { logout } from '@/store/authSlice';
import { Wallet } from 'lucide-react';
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
				'bg-background  sticky top-0 z-10 w-full mx-auto px-2 md:px-8 h-16 flex items-center justify-between',
				user ? 'max-w-6xl' : 'max-w-xl',
			)}
		>
			<div className="flex items-center gap-2">
				<Wallet />
				<div className="text-xl font-bold text-primary">Fintrack</div>
			</div>

			{user && (
				<div className="flex items-center gap-4">
					<span className="text-sm font-medium hidden sm:block">
						{user.name}
					</span>
					<Button
						variant="outline"
						size="sm"
						className="cursor-pointer"
						onClick={handleLogout}
					>
						Log out
					</Button>
				</div>
			)}
		</header>
	);
};

export default Header;
