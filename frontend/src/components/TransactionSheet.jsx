import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

import TransactionForm from './TransactionForm';

const TransactionSheet = () => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" className="cursor-pointer">
					Add Transaction
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Add Transaction</SheetTitle>
					<SheetDescription>Click save when you&apos;re done.</SheetDescription>
				</SheetHeader>

				<Tabs defaultValue="overview">
					<TabsList variant="line">
						<TabsTrigger value="income">Income</TabsTrigger>
						<TabsTrigger value="expense">Expense</TabsTrigger>
					</TabsList>
					<TabsContent value="income">
						<TransactionForm type="income" />
					</TabsContent>
					<TabsContent value="expense">
						<TransactionForm type="expense" />
					</TabsContent>
				</Tabs>
			</SheetContent>
		</Sheet>
	);
};

export default TransactionSheet;
