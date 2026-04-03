import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from './ui/field';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ChevronDownIcon, Trash2Icon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from './ui/calendar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '@/store/categorySlice';
import {
	addTransaction,
	deleteTransaction,
	editTransaction,
} from '@/store/transactionSlice';
import { Controller, useForm } from 'react-hook-form';
import { transactionFormSchema } from '@/validations/transaction';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from './ui/input-group';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './ui/alert-dialog';
import { CURRENCY_OPTIONS } from '@/utils/constants';

const TransactionForm = ({ type, setSheetOpen, initialData }) => {
	const dispatch = useDispatch();
	const { items: categories } = useSelector((state) => state.categories);
	const { user } = useSelector((state) => state.auth);

	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (categories.length === 0) {
			dispatch(fetchCategories());
		}
	}, [categories.length, dispatch]);

	const filteredCategories = categories.filter((cat) => cat.type === type);

	const form = useForm({
		resolver: zodResolver(transactionFormSchema),
		defaultValues: {
			title: initialData?.title || '',
			amount: initialData?.amount || '',
			type: type || 'Expense',
			currency: initialData?.currency || user?.currency,
			category:
				initialData?.type === type ? initialData?.category?.id || '' : '',
			description: initialData?.description || '',
			tags: initialData?.tags?.join(', ') || '',
			date: initialData?.date ? new Date(initialData.date) : new Date(),
			time: initialData?.date
				? format(new Date(initialData.date), 'HH:mm')
				: format(new Date(), 'HH:mm'),
		},
	});

	useEffect(() => {
		form.setValue('type', type);
	}, [type, form]);

	const onSubmit = async (data) => {
		const formattedTags = data.tags
			? data.tags
					.split(',')
					.map((tag) => tag.trim())
					.filter((tag) => tag !== '')
			: [];

		const finalDate = new Date(data.date);
		const [hours, minutes] = data.time.split(':');
		finalDate.setHours(Number(hours), Number(minutes), 0, 0);

		const apiPayload = {
			...data,
			amount: Number(data.amount),
			tags: formattedTags,
			date: finalDate.toISOString(),
		};

		delete apiPayload.time;

		try {
			if (initialData) {
				await dispatch(
					editTransaction({ id: initialData.id, apiPayload }),
				).unwrap();
				toast.success('Transaction edited!');
			} else {
				await dispatch(addTransaction(apiPayload)).unwrap();
				toast.success('Transaction saved!');
			}

			if (setSheetOpen) {
				setSheetOpen(false);
			}
		} catch (error) {
			if (initialData) {
				toast.error('Failed to edit transaction');
				console.error('Failed to edit transaction:', error);
			} else {
				toast.error('Failed to save transaction');
				console.error('Failed to save transaction:', error);
			}
		}
	};

	const handleDelete = async () => {
		try {
			await dispatch(deleteTransaction(initialData.id)).unwrap();
			setSheetOpen(false);
			toast.success('Transaction deleted');
		} catch (e) {
			toast.error('Failed to delete transaction!');
		}
	};

	return (
		<div className="grid flex-1 auto-rows-min gap-6 px-4 overflow-y-auto max-h-[80vh] pb-8">
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
				<Controller
					name="title"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>Title (optional)</FieldLabel>
							<Input
								{...field}
								id={field.name}
								aria-invalid={fieldState.invalid}
								placeholder="Title"
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
				<Field
					data-invalid={
						!!form.formState.errors.amount || !!form.formState.errors.currency
					}
				>
					<FieldLabel htmlFor="amount">Amount</FieldLabel>

					<div className="flex gap-2">
						<Controller
							name="currency"
							control={form.control}
							render={({ field, fieldState }) => (
								<Select
									name={field.name}
									value={field.value}
									onValueChange={field.onChange}
									disabled={true}
								>
									<SelectTrigger
										id={field.name}
										aria-invalid={fieldState.invalid}
										className="w-20"
									>
										<SelectValue placeholder="Currency" />
									</SelectTrigger>
									<SelectContent position="item-aligned">
										{CURRENCY_OPTIONS.map((curr) => (
											<SelectItem key={curr.code} value={curr.code}>
												{curr.symbol}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>

						<Controller
							name="amount"
							control={form.control}
							render={({ field, fieldState }) => (
								<Input
									{...field}
									id="amount" // Matches the FieldLabel htmlFor
									type="number"
									step="any"
									aria-invalid={fieldState.invalid}
									placeholder="0.00"
									className="flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
								/>
							)}
						/>
					</div>

					{form.formState.errors.amount && (
						<FieldError
							className="text-start"
							errors={[form.formState.errors.amount]}
						/>
					)}
					{form.formState.errors.currency && (
						<FieldError
							className="text-start"
							errors={[form.formState.errors.currency]}
						/>
					)}
				</Field>

				<Controller
					name="category"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field orientation="responsive" data-invalid={fieldState.invalid}>
							<FieldContent>
								<FieldLabel htmlFor={field.name}>Category</FieldLabel>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</FieldContent>
							<Select
								name={field.name}
								value={field.value}
								onValueChange={field.onChange}
							>
								<SelectTrigger
									id={field.name}
									aria-invalid={fieldState.invalid}
									className="min-w-30"
								>
									<SelectValue placeholder="Select" />
								</SelectTrigger>
								<SelectContent position="item-aligned">
									{filteredCategories.map((cat) => (
										<SelectItem key={cat.id} value={cat.id}>
											<span className="mr-2">{cat.emoji}</span>
											{cat.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
					)}
				/>
				<FieldGroup className="grid grid-cols-2 gap-4">
					<Controller
						name="date"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Date</FieldLabel>
								<Popover open={open} onOpenChange={setOpen}>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											id={field.name}
											className="justify-between font-normal w-full"
											aria-invalid={fieldState.invalid}
										>
											{field.value ? format(field.value, 'PPP') : 'Select date'}
											<ChevronDownIcon className="h-4 w-4 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent
										className="w-auto overflow-hidden p-0"
										align="start"
									>
										<Calendar
											mode="single"
											selected={field.value}
											captionLayout="dropdown"
											defaultMonth={field.value}
											onSelect={(selectedDate) => {
												if (selectedDate) {
													field.onChange(selectedDate);
												}
												setOpen(false);
											}}
										/>
									</PopoverContent>
								</Popover>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="time"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Time</FieldLabel>
								<Input
									{...field}
									type="time"
									id={field.name}
									aria-invalid={fieldState.invalid}
									className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none w-full"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</FieldGroup>

				<Controller
					name="description"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>
								Description (optional)
							</FieldLabel>
							<InputGroup>
								<InputGroupTextarea
									{...field}
									id={field.name}
									placeholder="Description"
									rows={4}
									className="min-h-24 resize-none"
									aria-invalid={fieldState.invalid}
								/>
								<InputGroupAddon align="block-end">
									<InputGroupText className="tabular-nums">
										{field.value.length}/250 characters
									</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<Controller
					name="tags"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>
								Tags (comma separated, optional)
							</FieldLabel>
							<Input
								{...field}
								id={field.name}
								aria-invalid={fieldState.invalid}
								placeholder="chai, snacks"
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

				{initialData ? (
					<div className="flex w-full items-center justify-between pt-6 mt-4">
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="destructive"
									type="button"
									className="cursor-pointer"
								>
									Delete
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent size="sm">
								<AlertDialogHeader>
									<AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
										<Trash2Icon />
									</AlertDialogMedia>
									<AlertDialogTitle>Delete transaction?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete
										this transaction from your records and update your balance.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel
										variant="outline"
										className="cursor-pointer"
									>
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction
										variant="destructive"
										className="cursor-pointer"
										onClick={handleDelete}
										disabled={form.formState.isSubmitting}
									>
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>

						<div className="flex gap-3">
							<Button
								type="button"
								variant="outline"
								className="cursor-pointer"
								onClick={() => setSheetOpen(false)}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="cursor-pointer"
								disabled={form.formState.isSubmitting}
							>
								Save Changes
							</Button>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-2 gap-3 w-full pt-6 mt-4">
						<Button
							type="button"
							variant="outline"
							className="cursor-pointer"
							onClick={() => setSheetOpen(false)}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="cursor-pointer"
							disabled={form.formState.isSubmitting}
						>
							Add Transaction
						</Button>
					</div>
				)}
			</form>
		</div>
	);
};

export default TransactionForm;
