import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { SheetClose, SheetFooter } from './ui/sheet';
import { Button } from './ui/button';

const TransactionForm = ({ type }) => {
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
		<div className="grid flex-1 auto-rows-min gap-6 px-4">
			{type}
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
	);
};

export default TransactionForm;
