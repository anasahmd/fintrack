import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';

const TransactionForm = () => {
	const [formData, setFormData] = useState({
		amount: 0,
		type: 'Expense',
		category: '',
		description: '',
		tags: '',
		date: new Date(),
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		console.log(formData);
	};

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" className="cursor-pointer">
					Add Transaction
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Add Transaction</SheetTitle>
					<SheetDescription>Click save when you&apos;re done.</SheetDescription>
				</SheetHeader>
				<div className="grid flex-1 auto-rows-min gap-6 px-4">
					<form onSubmit={handleSubmit} className="space-y-6 mt-6">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="amount">Amount</Label>
								<Input
									id="amount"
									name="amount"
									type="number"
									step="0.01"
									placeholder="0.00"
									value={formData.amount}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="type">Type</Label>
								{/* Shadcn Select doesn't use standard event targets, so we update state directly */}
								<Select
									value={formData.type}
									onValueChange={(value) =>
										setFormData((prev) => ({ ...prev, type: value }))
									}
								>
									<SelectTrigger id="type">
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Expense">Expense</SelectItem>
										<SelectItem value="Income">Income</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="category">Category</Label>
								<Input
									id="category"
									name="category"
									placeholder="e.g. Food"
									value={formData.category}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="date">Date</Label>
								<Input
									id="date"
									name="date"
									type="date"
									value={formData.date}
									onChange={handleChange}
									required
								/>
							</div>
						</div>

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
						<SheetFooter>
							<Button type="submit">Save</Button>
							<SheetClose asChild>
								<Button variant="outline">Close</Button>
							</SheetClose>
						</SheetFooter>
					</form>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default TransactionForm;
