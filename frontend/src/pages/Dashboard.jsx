import { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import TransactionList from '@/components/TransactionList';
import TransactionChart from '@/components/TransactionChart';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '@/store/transactionSlice';
import { formatCompactCurrency, formatCurrency } from '@/utils/formatCurrency';
import { useSearchParams } from 'react-router-dom';
import TransactionFormModal from '@/components/TransactionFormModal';

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
		<div className="mt-12 mx-auto space-y-8">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Hey, {user.name}! 👋</h1>
				<TransactionFormModal />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader>
						<CardDescription>Total Balance</CardDescription>
						<CardTitle className="text-2xl font-semibold">
							{formatCurrency(balance, user.currency)}
						</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Total Income</CardDescription>
						<CardTitle className="text-2xl font-semibold">
							{formatCurrency(income, user.currency)}
						</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Total Expense</CardDescription>
						<CardTitle className="text-2xl font-semibold">
							{formatCurrency(expense, user.currency)}
						</CardTitle>
					</CardHeader>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
				<div className="lg:col-span-3">
					<TransactionChart
						transactions={transactions}
						month={viewMonth}
						year={viewYear}
					/>
				</div>

				<div className="lg:col-span-2">
					<TransactionList transactions={transactions} />
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
