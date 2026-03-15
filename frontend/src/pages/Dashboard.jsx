import { useState, useEffect } from 'react';
import transactionService from '@/services/transactions';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import RecentTransactions from '@/components/RecentTransactions';

const Dashboard = ({ user, handleLogout }) => {
	const [transactions, setTransactions] = useState([]);

	// 1. Fetch the data
	useEffect(() => {
		transactionService.getAll().then((data) => setTransactions(data));
	}, []);

	// 2. Derive the totals instantly
	const income = transactions
		.filter((t) => t.type === 'Income')
		.reduce((acc, t) => acc + t.amount, 0);

	const expense = transactions
		.filter((t) => t.type === 'Expense')
		.reduce((acc, t) => acc + Math.abs(t.amount), 0);

	const balance = income - expense;

	return (
		<div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
			{/* Top Header */}
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Hey, {user.name}! 👋</h1>
				<Button variant="outline" onClick={() => {}} className="cursor-pointer">
					Add Transaction
				</Button>
			</div>

			{/* Summary Cards (3 Columns on Desktop, 1 on Mobile) */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader>
						<CardDescription>Total Balance</CardDescription>
						<CardTitle className="text-2xl font-semibold">
							$ {balance}
						</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Total Income</CardDescription>
						<CardTitle className="text-2xl font-semibold">$ {income}</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Total Expense</CardDescription>
						<CardTitle className="text-2xl font-semibold">
							$ {expense}
						</CardTitle>
					</CardHeader>
				</Card>
			</div>

			{/* Main Layout Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* LEFT SIDE (2/3 Width): The Table */}
				<div className="lg:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle>Add Transaction</CardTitle>
						</CardHeader>
						<CardContent>
							{/* Your input fields and submit button go here! */}
							<div className="p-8 text-center text-zinc-500 border-2 border-dashed">
								Form Placeholder
							</div>
						</CardContent>
					</Card>
				</div>

				{/* RIGHT SIDE (1/3 Width): The Form */}
				<div className="lg:col-span-1">
					<RecentTransactions transactions={transactions} />
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
