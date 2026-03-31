import { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import RecentTransactions from '@/components/RecentTransactions';
import TransactionChart from '@/components/TransactionChart';
import TransactionSheet from '@/components/TransactionSheet';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '@/store/transactionSlice';

const Dashboard = () => {
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.auth);

	const [viewMonth, setViewMonth] = useState(new Date().getMonth());
	const [viewYear, setViewYear] = useState(new Date().getFullYear());

	const { items: transactions } = useSelector((state) => state.transactions);

	useEffect(() => {
		dispatch(fetchTransactions());
	}, [dispatch]);

	const income = transactions
		.filter((t) => t.type === 'Income')
		.reduce((acc, t) => acc + t.amount, 0);

	const expense = transactions
		.filter((t) => t.type === 'Expense')
		.reduce((acc, t) => acc + Math.abs(t.amount), 0);

	const balance = income - expense;

	return (
		<div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Hey, {user.name}! 👋</h1>
				<TransactionSheet />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader>
						<CardDescription>Total Balance</CardDescription>
						<CardTitle className="text-2xl font-semibold">₹{balance}</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Total Income</CardDescription>
						<CardTitle className="text-2xl font-semibold">₹{income}</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Total Expense</CardDescription>
						<CardTitle className="text-2xl font-semibold">₹{expense}</CardTitle>
					</CardHeader>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
				<div className="lg:col-span-3">
					<TransactionChart transactions={transactions} />
				</div>

				<div className="lg:col-span-2">
					<RecentTransactions
						transactions={transactions}
						month={viewMonth}
						year={viewYear}
					/>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
