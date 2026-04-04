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
		<section className="flex w-full items-center justify-center py-8 text-start">
			<div className="w-full max-w-md space-y-6">
				<h2 className="mt-6 text-3xl font-bold">Welcome back</h2>
				<p className="mb-8">Please enter your details</p>
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
								<FieldLabel htmlFor={field.name} className="font-medium">
									Email address
								</FieldLabel>
								<Input
									{...field}
									id={field.name}
									type="email"
									aria-invalid={fieldState.invalid}
									placeholder="Enter your email"
									autoComplete="email"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						name="password"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name} className="font-medium">
									Password
								</FieldLabel>
								<Input
									{...field}
									id={field.name}
									type="password"
									aria-invalid={fieldState.invalid}
									autoComplete="current-password"
									placeholder="Password"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<div className="flex items-center justify-between">
						<Link
							to="/forgot-password"
							className="text-sm hover:underline font-medium "
						>
							Forgot password
						</Link>
					</div>

					<div>
						<Button
							type="submit"
							className="w-full cursor-pointer font-medium text-sm"
						>
							Login
						</Button>
					</div>
				</form>

				<div className="mt-10 text-center">
					Don't have an account?{' '}
					<Link to="/register" className="text-primary font-medium">
						Sign Up
					</Link>
				</div>
			</div>
		</section>
	);
};

export default Login;
