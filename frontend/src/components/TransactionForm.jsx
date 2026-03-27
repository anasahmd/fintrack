import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { SheetClose, SheetFooter } from './ui/sheet';
import { Button } from './ui/button';
import categoryService from '@/services/categories';
import { Field, FieldGroup, FieldLabel } from './ui/field';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ChevronDownIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from './ui/calendar';
import transactionService from '@/services/transactions';

const TransactionForm = ({ type }) => {
	const [categories, setCategories] = useState([]);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		categoryService.getAll().then((data) => setCategories(data));
	}, []);

	const [formData, setFormData] = useState({
		amount: 0,
		type: type || 'Expense',
		category: '',
		description: '',
		tags: '',
		date: new Date(),
		time: format(new Date(), 'HH:mm'),
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formattedTags = formData.tags
			.split(',')
			.map((tag) => tag.trim())
			.filter((tag) => tag !== '');

		const finalDate = new Date(formData.date);
		const [hours, minutes] = formData.time.split(':');
		finalDate.setHours(Number(hours), Number(minutes), 0, 0);

		const apiPayload = {
			...formData,
			amount: Number(formData.amount),
			tags: formattedTags,
			date: finalDate.toISOString(),
		};

		delete apiPayload.time;

		try {
			const savedTransaction = await transactionService.create(apiPayload);
			console.log('Successfully saved:', savedTransaction);
		} catch (error) {
			console.error('Failed to save transaction:', error);
		}

		console.log(apiPayload);
	};

	const filteredCategories = categories.filter((cat) => cat.type === type);

	return (
		<div className="grid flex-1 auto-rows-min gap-6 px-4">
			<form onSubmit={handleSubmit} className="space-y-6 mt-6">
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="amount">Amount</Label>
						<Input
							id="amount"
							name="amount"
							type="number"
							step="10"
							placeholder="0.00"
							value={formData.amount}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="category">Category</Label>
						<Select
							value={formData.category}
							onValueChange={(value) =>
								setFormData((prev) => ({ ...prev, category: value }))
							}
							required
						>
							<SelectTrigger id="category">
								<SelectValue placeholder="Select a category" />
							</SelectTrigger>
							<SelectContent>
								{filteredCategories.map((cat) => (
									<SelectItem key={cat.id} value={cat.id}>
										<span className="mr-2">{cat.emoji}</span>
										{cat.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<FieldGroup className="mx-auto flex-row">
					<Field>
						<FieldLabel htmlFor="date-picker">Date</FieldLabel>
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									id="date-picker"
									className="justify-between font-normal"
								>
									{formData.date ? format(formData.date, 'PPP') : 'Select date'}
									<ChevronDownIcon />
								</Button>
							</PopoverTrigger>
							<PopoverContent
								className="w-auto overflow-hidden p-0"
								align="start"
							>
								<Calendar
									mode="single"
									selected={formData.date}
									captionLayout="dropdown"
									defaultMonth={formData.date}
									onSelect={(selectedDate) => {
										if (selectedDate) {
											setFormData((prev) => ({
												...prev,
												date: selectedDate,
											}));
										}
										setOpen(false);
									}}
								/>
							</PopoverContent>
						</Popover>
					</Field>
					<Field className="">
						<FieldLabel htmlFor="time-picker">Time</FieldLabel>
						<Input
							type="time"
							id="time-picker"
							name="time"
							value={formData.time}
							onChange={handleChange}
							defaultValue="10:30"
							className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
						/>
					</Field>
				</FieldGroup>

				<div className="space-y-2">
					<Label htmlFor="description">Description</Label>
					<Input
						id="description"
						name="description"
						placeholder="What was this for?"
						value={formData.description}
						onChange={handleChange}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="tags">Tags (Comma separated)</Label>
					<Input
						id="tags"
						name="tags"
						placeholder="chai, snacks"
						value={formData.tags}
						onChange={handleChange}
					/>
				</div>
				<SheetFooter className="w-full px-0 py-2">
					<Button type="submit">Save</Button>
					<SheetClose asChild>
						<Button variant="outline">Close</Button>
					</SheetClose>
				</SheetFooter>
			</form>
		</div>
	);
};

export default TransactionForm;
