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
		<section className="flex w-full items-center justify-center py-8 text-start">
			<div className="w-full max-w-md space-y-6">
				<h2 className="mt-6 text-3xl font-bold">Create an account</h2>
				<p className="mb-8">Please enter your details to get started</p>
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
								<FieldLabel htmlFor={field.name} className="font-medium">
									Full Name
								</FieldLabel>
								<Input
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
									placeholder="Enter your name"
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
								<FieldLabel htmlFor={field.name} className="font-medium">
									Password
								</FieldLabel>
								<Input
									{...field}
									id={field.name}
									type="password"
									aria-invalid={fieldState.invalid}
									autoComplete="new-password"
									placeholder="Password"
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
								<FieldLabel htmlFor={field.name} className="font-medium">
									Confirm Password
								</FieldLabel>
								<Input
									{...field}
									id={field.name}
									type="password"
									aria-invalid={fieldState.invalid}
									autoComplete="new-password"
									placeholder="Password"
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

					<Button
						type="submit"
						className="w-full mt-4 cursor-pointer font-medium text-sm"
					>
						Signup
					</Button>
				</form>

				<div className="mt-10 text-center">
					Already have an account?{' '}
					<Link to="/login" className="text-primary font-medium">
						Sign In
					</Link>
				</div>
			</div>
		</section>
	);
};

export default Register;
