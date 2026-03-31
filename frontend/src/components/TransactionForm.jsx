import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { SheetClose, SheetFooter } from './ui/sheet';
import { Button } from './ui/button';
import categoryService from '@/services/categories';
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from './ui/field';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ChevronDownIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from './ui/calendar';
import transactionService from '@/services/transactions';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '@/store/categorySlice';
import { addTransaction } from '@/store/transactionSlice';
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

const TransactionForm = ({ type, setSheetOpen }) => {
	const dispatch = useDispatch();
	const { items: categories } = useSelector((state) => state.categories);

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
			title: '',
			amount: '',
			type: type || 'Expense',
			category: '',
			description: '',
			tags: '',
			date: new Date(),
			time: format(new Date(), 'HH:mm'),
		},
	});

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
			await dispatch(addTransaction(apiPayload)).unwrap();

			toast.success('Transaction saved!');
			if (setSheetOpen) {
				setSheetOpen(false);
			}
		} catch (error) {
			toast.error('Failed to save transaction');
			console.error('Failed to save transaction:', error);
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
				<Controller
					name="amount"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>Amount</FieldLabel>

							<div className="relative flex items-center">
								<span className="absolute left-3 text-muted-foreground">₹</span>
								<Input
									{...field}
									id={field.name}
									type="number"
									step="any"
									aria-invalid={fieldState.invalid}
									placeholder="0.00"
									// pl-8 pushes the typing cursor past the ₹ symbol
									className="pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
								/>
							</div>
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
				<SheetFooter className="w-full px-0 py-2">
					<Button type="submit">
						{form.formState.isSubmitting ? 'Saving...' : 'Save'}
					</Button>
					<SheetClose asChild>
						<Button variant="outline">Close</Button>
					</SheetClose>
				</SheetFooter>
			</form>
		</div>
	);
};

export default TransactionForm;
