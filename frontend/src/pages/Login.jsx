import { useState } from 'react';
import loginService from '@/services/login';
import transactionService from '@/services/transactions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Login = ({ setUser }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState(null);

	const navigate = useNavigate();

	const handleLogin = async (event) => {
		event.preventDefault();

		try {
			const user = await loginService.login({
				email,
				password,
			});

			window.localStorage.setItem('loggedInUser', JSON.stringify(user));

			transactionService.setToken(user.token);

			setUser(user);
			setEmail('');
			setPassword('');
			toast.success('Welcome back');

			navigate();
		} catch (exception) {
			console.log(exception);

			toast.error('Wrong credentials');

			setTimeout(() => {
				setErrorMessage(null);
			}, 5000);
		}
	};

	return (
		<div className="flex h-screen items-center justify-center bg-accent">
			<section className="flex min-h-screen w-full items-center justify-center py-4 lg:py-20">
				<div className="w-full max-w-sm space-y-6">
					<h2 className="mt-6 text-3xl text-start font-semibold">
						Sign in to your account
					</h2>
					<form onSubmit={handleLogin} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="email">Email address</Label>
							<Input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="mt-1"
								value={email}
								onChange={({ target }) => {
									setEmail(target.value);
								}}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								className="mt-1"
								value={password}
								onChange={({ target }) => {
									setPassword(target.value);
								}}
							/>
						</div>

						<div className="flex items-center justify-between">
							<Link to="/forgot-password" className="text-sm hover:underline ">
								Forgot your password?
							</Link>
						</div>

						<div>
							<Button type="submit" className="w-full cursor-pointer">
								Signin
							</Button>
						</div>
					</form>

					<div className="space-y-6 lg:mt-10">
						Don't have an account?{' '}
						<Link to="/auth/register" className="underline">
							Sign Up
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Login;
