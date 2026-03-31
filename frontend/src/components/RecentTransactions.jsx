import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { formatTransactionDate } from '@/utils/date';

const RecentTransactions = ({ transactions }) => {
	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle>Recent Transactions</CardTitle>
				<CardDescription>
					You've made {transactions.length} transactions
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-8">
					{transactions.map((transaction, index) => (
						<div
							key={transaction.id}
							className="flex bg-accent p-4 rounded-xl gap-4 items-center mb-4"
						>
							<div className="text-lg">{transaction.category.emoji}</div>
							<div className="flex flex-col items-start gap-1">
								<p className="text-base font-semibold">
									{transaction.description
										? transaction.description
										: transaction.category.name}
								</p>
								<p className="text-sm text-accent-foreground">
									{formatTransactionDate(transaction.date, 'dd MMM, hh:mm a')}
								</p>
							</div>
							<div className="text-sm font-semibold ms-auto">
								{transaction.type === 'Income' ? (
									<div className="text-teal-700">+₹{transaction.amount}</div>
								) : (
									<div className="text-red-600">-₹{transaction.amount}</div>
								)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default RecentTransactions;
