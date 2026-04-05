import { logout } from '@/store/authSlice';
import {
	ChevronDown,
	Code,
	CreditCard,
	ExternalLink,
	Github,
	Link,
	LogOut,
	LogOutIcon,
	Moon,
	Settings,
	Sun,
	User,
	Wallet,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTheme } from './ThemeProvider';

const Header = () => {
	const { theme, setTheme } = useTheme();
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
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="cursor-pointer">
							{user.name} <ChevronDown />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuGroup>
							<DropdownMenuItem className="cursor-pointer">
								<User className="mr-2 h-4 w-4" />
								<span>Profile</span>
							</DropdownMenuItem>
							<DropdownMenuItem className="cursor-pointer">
								<Settings className="mr-2 h-4 w-4" />
								<span>Settings</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem className="cursor-pointer text-primary hover:text-foreground">
								<CreditCard className="mr-2 h-4 w-4" />
								<span>Upgrade to Pro</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
							>
								<div className="relative mr-2 flex h-4 w-4 items-center justify-center">
									<Sun className="absolute h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
									<Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
								</div>
								<span>Toggle theme</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem className="cursor-pointer">
								<Code className="mr-2 h-4 w-4" />
								<span>Source Code</span>
							</DropdownMenuItem>
							<DropdownMenuItem className="cursor-pointer">
								<Link className="mr-2 h-4 w-4" />
								<span>Anas' Website</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem
								className="cursor-pointer"
								variant="destructive"
								onClick={handleLogout}
							>
								<LogOut className="mr-2 h-4 w-4" />
								<span>Log out</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
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
