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
						<TabsTrigger value="Expense">Expense</TabsTrigger>
						<TabsTrigger value="Income">Income</TabsTrigger>
					</TabsList>
					<TabsContent value="Expense">
						<TransactionForm type="Expense" />
					</TabsContent>
					<TabsContent value="Income">
						<TransactionForm type="Income" />
					</TabsContent>
				</Tabs>
			</SheetContent>
		</Sheet>
	);
};

export default TransactionSheet;
