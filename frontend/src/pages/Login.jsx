import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loginUser } from '@/store/authSlice';
import { useDispatch } from 'react-redux';
import { loginSchema } from '@/validations/auth';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (data) => {
		try {
			const user = await dispatch(
				loginUser({
					email: data.email,
					password: data.password,
				}),
			).unwrap();

			toast.success('Welcome back');
			navigate('/');
		} catch (exception) {
			toast.error(exception);
		}
	};

	return (
		<div className="flex h-screen items-center justify-center bg-accent">
			<section className="flex min-h-screen w-full items-center justify-center py-4 lg:py-20">
				<div className="w-full max-w-sm space-y-6">
					<h2 className="mt-6 text-3xl text-start font-semibold">
						Sign in to your account
					</h2>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
						noValidate
					>
						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Email address</FieldLabel>
									<Input
										{...field}
										id={field.name}
										type="email"
										aria-invalid={fieldState.invalid}
										placeholder="name@example.com"
										autoComplete="email"
									/>
									{fieldState.invalid && (
										<FieldError
											className="text-start"
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>
						<Controller
							name="password"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Password</FieldLabel>
									<Input
										{...field}
										id={field.name}
										type="password"
										aria-invalid={fieldState.invalid}
										autoComplete="current-password"
									/>
									{fieldState.invalid && (
										<FieldError
											className="text-start"
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>

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
						<Link to="/register" className="underline">
							Sign Up
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Login;
