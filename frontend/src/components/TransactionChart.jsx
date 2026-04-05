import {
	Area,
	AreaChart,
	CartesianGrid,
	Line,
	XAxis,
	LineChart,
	YAxis,
} from 'recharts';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { useDateFilter } from '@/hooks/useDateFilter';
import { useSelector } from 'react-redux';
import { formatCompactCurrency } from '@/utils/formatCurrency';

const chartConfig = {
	balance: {
		label: 'Balance',
		color: 'var(--primary)',
	},
};

const TransactionChart = ({ transactions, startingBalance = 0 }) => {
	const { user } = useSelector((state) => state.auth);

	const { from, to } = useDateFilter();

	if (!transactions || transactions.length === 0) {
		return (
			<Card className="flex h-87.5 items-center justify-center border-dashed">
				<p className="">No transaction data available.</p>
			</Card>
		);
	}

	const now = new Date();
	const todayAtMidnight = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
	);

	const chartEndDate = to > todayAtMidnight ? todayAtMidnight : to;

	// Group transactions by date
	const transactionsByDate = {};
	transactions.forEach((t) => {
		const dateStr = new Date(t.date).toLocaleDateString('en-US');
		if (!transactionsByDate[dateStr]) {
			transactionsByDate[dateStr] = [];
		}
		transactionsByDate[dateStr].push(t);
	});

	const chartData = [];

	let runningBalance = startingBalance;

	for (let d = new Date(from); d <= chartEndDate; d.setDate(d.getDate() + 1)) {
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

	return (
		<Card>
			<CardHeader>
				<CardTitle>Balance Overview</CardTitle>
				<CardDescription>Your cumulative cash flow over time</CardDescription>
			</CardHeader>
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full"
				>
					<AreaChart
						data={chartData}
						margin={{ left: 12, right: 12, top: 12, bottom: 20 }}
					>
						{/* 1. Define the smooth fading gradient */}
						<defs>
							<linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-balance)"
									stopOpacity={0.4}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-balance)"
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>

						<CartesianGrid vertical={false} />
						<XAxis dataKey="date" hide />
						<YAxis
							axisLine={false}
							tickLine={false}
							tickMargin={8}
							tickFormatter={(value) =>
								formatCompactCurrency(value, user.currency)
							}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="dot" />}
						/>

						{/* 2. Use Area, link the gradient, and hide the static dots! */}
						<Area
							type="monotone"
							dataKey="balance"
							stroke="var(--color-balance)"
							strokeWidth={2}
							fillOpacity={1}
							fill="url(#colorBalance)" // Links to the <defs> id above
							dot={false} // HIDES THE STATIC DOTS
							activeDot={{
								stroke: 'var(--background)',
								strokeWidth: 2,
								r: 6,
								fill: 'var(--color-balance)',
							}}
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};

export default TransactionChart;
