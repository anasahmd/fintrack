import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Separator } from './ui/separator';

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
						<div key={transaction.id}>
							<div className="flex items-center pb-2">
								<div className="text-start">
									<p className="text-sm leading-none font-medium pb-2">
										{transaction.description}
									</p>
									<p className="text-muted-foreground text-sm">
										{`${transaction.category.emoji} ${transaction.category.name}`}
									</p>
								</div>
								<div className="ml-auto font-medium">
									{transaction.type === 'Income' ? (
										<div className="text-teal-700">+{transaction.amount}</div>
									) : (
										<div className="text-red-600">-{transaction.amount}</div>
									)}
								</div>
							</div>
							{transactions.length - 1 !== index && <Separator />}
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default RecentTransactions;
