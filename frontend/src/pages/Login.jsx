import { useState } from 'react';
import loginService from '@/services/login';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState(null);

	const navigate = useNavigate();

	const handleLogin = async (event) => {
		event.preventDefault();

		console.log('click');

		try {
			const user = await loginService.login({
				email,
				password,
			});

			console.log(user);

			window.localStorage.setItem('loggedInUser', JSON.stringify(user));

			// transactionService.setToken(user.token);

			setUser(user);
			setEmail('');
			setPassword('');

			navigate();
		} catch (exception) {
			console.log(exception);

			setErrorMessage('Wrong credentials');
			setTimeout(() => {
				setErrorMessage(null);
			}, 5000);
		}
	};

	return (
		<div className="flex h-screen items-center justify-center bg-zinc-50">
			<Card className="w-87.5">
				<CardHeader>
					<CardTitle>Welcome back</CardTitle>
					<CardDescription>Enter your credentials to login!</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleLogin} className="space-y-4">
						{errorMessage && (
							<p className="text-sm text-red-500 text-center">{errorMessage}</p>
						)}

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="text"
								value={email}
								onChange={({ target }) => setEmail(target.value)}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={({ target }) => setPassword(target.value)}
							/>
						</div>

						<Button type="submit" className="w-full">
							Log in
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default Login;
