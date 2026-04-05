import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { formatTransactionDate } from '@/utils/date';
import { formatCompactCurrency } from '@/utils/formatCurrency';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

const TransactionList = ({ transactions }) => {
	const [searchParams, setSearchParams] = useSearchParams();

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
							className="flex border-accent border-2 p-4 rounded-xl gap-4 items-center mb-3 cursor-pointer"
							onClick={() =>
								setSearchParams({ editTransaction: transaction.id })
							}
						>
							<div className="text-lg">{transaction.category.emoji}</div>
							<div className="flex flex-col items-start gap-1 text-secondary-foreground">
								<p className="text-base font-semibold">
									{transaction.title
										? transaction.title
										: transaction.category.name}
								</p>
								<p className="text-sm">
									{formatTransactionDate(transaction.date, 'dd MMM, hh:mm a')}
								</p>
							</div>
							<div className="text-sm font-semibold ms-auto">
								{transaction.type === 'Income' ? (
									<div className="text-success">
										+
										{formatCompactCurrency(
											transaction.amount,
											transaction.currency,
										)}
									</div>
								) : (
									<div className="text-destructive">
										-
										{formatCompactCurrency(
											transaction.amount,
											transaction.currency,
										)}
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default TransactionList;
