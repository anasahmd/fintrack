import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { registerUser } from '@/store/authSlice';
import { useDispatch } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { registerSchema } from '@/validations/auth';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

const Register = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const form = useForm({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	const onSubmit = async (data) => {
		try {
			const response = await dispatch(
				registerUser({
					name: data.name,
					email: data.email,
					password: data.password,
				}),
			).unwrap();

			toast.success('Registration successfull');
			navigate('/');
		} catch (exception) {
			toast.error(exception);
		}
	};

	return (
		<div className="flex h-screen items-center justify-center bg-accent">
			<section className="flex w-full items-center justify-center">
				<div className="w-full max-w-sm space-y-6">
					<h2 className="text-3xl font-semibold">Create a new account</h2>

					<form
						onSubmit={form.handleSubmit(onSubmit)}
						noValidate
						className="space-y-6"
					>
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
									<Input
										{...field}
										id={field.name}
										aria-invalid={fieldState.invalid}
										placeholder="John Doe"
										autoComplete="name"
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
										autoComplete="new-password"
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
							name="confirmPassword"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
									<Input
										{...field}
										id={field.name}
										type="password"
										aria-invalid={fieldState.invalid}
										autoComplete="new-password"
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

						<Button type="submit" className="w-full">
							Signup
						</Button>
					</form>

					<div className="space-y-6 lg:mt-10">
						Already have an account?{' '}
						<Link to="/login" className="underline">
							Sign In
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Register;
