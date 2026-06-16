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
import Emoji from './Emoji';

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
							key={transaction._id}
							className="flex border-accent border-2 p-4 rounded-xl gap-3 items-center mb-3 cursor-pointer"
							onClick={() =>
								setSearchParams({ editTransaction: transaction._id })
							}
						>
							<div className="text-lg shrink-0">
								<Emoji text={transaction.category.emoji} />
							</div>

							<div className="flex flex-col items-start gap-1 text-start text-secondary-foreground flex-1 min-w-0">
								<p className="text-base font-semibold truncate w-full">
									{transaction.title
										? transaction.title
										: transaction.category.name}
								</p>
								<p className="text-sm">
									{formatTransactionDate(transaction.date, 'dd MMM, hh:mm a')}
								</p>
							</div>

							<div className="text-sm font-semibold text-right shrink-0">
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
