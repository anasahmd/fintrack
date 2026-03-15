import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
	balance: {
		label: 'Balance',
		color: 'var(--primary)',
	},
};

const TransactionChart = ({
	transactions,
	month = new Date().getMonth(),
	year = new Date().getFullYear(),
}) => {
	if (!transactions || transactions.length === 0) {
		return (
			<Card className="flex h-87.5 items-center justify-center border-dashed">
				<p className="text-zinc-500">No transaction data available.</p>
			</Card>
		);
	}

	const now = new Date();

	const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

	const startOfMonth = new Date(year, month, 1);

	// Only generate the date till now if it's current month
	const endOfMonth = isCurrentMonth
		? new Date(now.getFullYear(), now.getMonth(), now.getDate())
		: new Date(year, month + 1, 0);

	const transactionsByDate = {};
	transactions.forEach((t) => {
		const dateStr = new Date(t.date).toLocaleDateString('en-US');
		if (!transactionsByDate[dateStr]) {
			transactionsByDate[dateStr] = [];
		}
		transactionsByDate[dateStr].push(t);
	});

	const chartData = [];
	let runningBalance = 0;

	for (
		let d = new Date(startOfMonth);
		d <= endOfMonth;
		d.setDate(d.getDate() + 1)
	) {
		const dateStr = d.toLocaleDateString('en-US');

		if (transactionsByDate[dateStr]) {
			transactionsByDate[dateStr].forEach((t) => {
				runningBalance += t.type === 'Income' ? t.amount : -t.amount;
			});
		}

		chartData.push({
			date: d.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
			}),
			balance: runningBalance,
		});
	}

	const xAxisTicks = [];
	for (let i = 1; i <= endOfMonth.getDate(); i += 7) {
		const tickDate = new Date(year, month, i);
		xAxisTicks.push(
			tickDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
		);
	}

	return (
		<Card className="@container/card">
			<CardHeader>
				<CardTitle>Balance Overview</CardTitle>
				<CardDescription>Your cumulative cash flow over time</CardDescription>
			</CardHeader>
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-62.5 w-full"
				>
					<AreaChart
						data={chartData}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<defs>
							<linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-balance)"
									stopOpacity={1.0}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-balance)"
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							ticks={xAxisTicks}
							interval="preserveStartEnd"
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="dot" />}
						/>
						<Area
							dataKey="balance"
							type="natural"
							fill="url(#fillBalance)"
							stroke="var(--color-balance)"
							stackId="a"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};

export default TransactionChart;
