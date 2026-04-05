import { useState, useEffect } from 'react';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import TransactionList from '@/components/TransactionList';
import TransactionChart from '@/components/TransactionChart';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '@/store/transactionSlice';
import { formatCompactCurrency, formatCurrency } from '@/utils/formatCurrency';
import TransactionFormModal from '@/components/TransactionFormModal';
import { useDateFilter } from '@/hooks/useDateFilter';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const DATE_RANGE_LABELS = {
	thisMonth: 'This Month',
	lastMonth: 'Last Month',
	last6Months: 'Last 6 Months',
	thisYear: 'This Year',
};

const Dashboard = () => {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const [dateRange, setDateRange] = useState('thisMonth');

	const { from, to, setPreset } = useDateFilter();

	useEffect(() => {
		setPreset(dateRange);
	}, [dateRange]);

	const fromString = from.toISOString();
	const toString = to.toISOString();

	useEffect(() => {
		dispatch(fetchTransactions({ from: fromString, to: toString }));
	}, [fromString, toString, dispatch]);

	const { items: transactions, startingBalance } = useSelector(
		(state) => state.transactions,
	);

	const income = transactions
		.filter((t) => t.type === 'Income')
		.reduce((acc, t) => acc + t.amount, 0);

	const expense = transactions
		.filter((t) => t.type === 'Expense')
		.reduce((acc, t) => acc + Math.abs(t.amount), 0);

	const balance = startingBalance + income - expense;

	return (
		<div className="mt-12 mx-auto space-y-8">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Hey, {user?.name}! 👋</h1>
				<div className="flex gap-4">
					<TransactionFormModal />
					<DropdownMenu className="cursor-pointer">
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="cursor-pointer">
								{DATE_RANGE_LABELS[dateRange]}
								<ChevronDown />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-42">
							<DropdownMenuGroup>
								<DropdownMenuRadioGroup
									value={dateRange}
									onValueChange={setDateRange}
								>
									<DropdownMenuRadioItem value="thisMonth">
										This Month
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="lastMonth">
										Last Month
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="last6Months">
										Last 6 Months
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="thisYear">
										This Year
									</DropdownMenuRadioItem>
								</DropdownMenuRadioGroup>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader>
						<CardDescription>Total Balance</CardDescription>
						<CardTitle className="text-2xl font-semibold">
							{formatCurrency(balance, user?.currency)}
						</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Total Income</CardDescription>
						<CardTitle className="text-2xl font-semibold">
							{formatCurrency(income, user?.currency)}
						</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Total Expense</CardDescription>
						<CardTitle className="text-2xl font-semibold">
							{formatCurrency(expense, user?.currency)}
						</CardTitle>
					</CardHeader>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
				<div className="lg:col-span-3">
					<TransactionChart
						transactions={transactions}
						startingBalance={startingBalance}
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
