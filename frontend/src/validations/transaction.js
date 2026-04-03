import { CURRENCY_OPTIONS } from '@/utils/constants';
import { z } from 'zod';

export const transactionFormSchema = z.object({
	title: z
		.string({ error: 'Invalid title' })
		.max(30, { error: 'Title cannot exceed 30 characters' })
		.optional(),

	amount: z.coerce
		.number({
			error: (issue) =>
				!issue.input ? 'Amount is required' : 'Amount must be a valid number',
		})
		.positive({ error: 'Amount must be greater than 0' }),

	type: z.enum(['Income', 'Expense'], {
		error: (issue) =>
			!issue.input ? 'Type is required' : 'Type must be Income or Expense',
	}),

	category: z
		.string({
			error: (issue) =>
				!issue.input ? 'Category is required' : 'Invalid category',
		})
		.min(1, { error: 'Please select a category' }),

	currency: z.enum(
		CURRENCY_OPTIONS.map((c) => c.code),
		{
			error: (issue) =>
				!issue.input ? 'Currency is required' : 'Invalid currency',
		},
	),

	date: z.date({
		error: (issue) =>
			!issue.input ? 'Date is required' : "That's not a valid date!",
	}),

	time: z
		.string({
			error: (issue) => (!issue.input ? 'Time is required' : 'Invalid time'),
		})
		.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
			error: 'Invalid time format',
		}),

	description: z
		.string({ error: 'Invalid description' })
		.max(250, { error: 'Description cannot exceed 250 characters' })
		.optional(),

	tags: z
		.string()
		.optional()
		.refine((val) => {
			if (!val) return true;
			const tagsArray = val
				.split(',')
				.map((t) => t.trim())
				.filter(Boolean);
			return tagsArray.length <= 10;
		}, 'You can only add up to 10 tags')
		.refine((val) => {
			if (!val) return true;
			const tagsArray = val
				.split(',')
				.map((t) => t.trim())
				.filter(Boolean);
			return tagsArray.every((t) => t.length <= 30);
		}, 'Each tag cannot exceed 30 characters'),
});
