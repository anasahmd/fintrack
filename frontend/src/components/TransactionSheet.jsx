import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

import TransactionForm from './TransactionForm';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const TransactionSheet = ({ initialData }) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const [isSheetOpen, setIsSheetOpen] = useState(Boolean(initialData) || false);

	const [activeTab, setActiveTab] = useState(initialData?.type || 'Expense');

	useEffect(() => {
		if (initialData !== undefined) {
			setIsSheetOpen(true);
		}
		if (initialData) {
			setActiveTab(initialData.type);
		} else {
			setActiveTab('Expense');
		}
	}, [initialData]);

	const handleOpenChange = (newOpenState) => {
		setIsSheetOpen(newOpenState);

		if (!newOpenState && searchParams.get('editTransaction')) {
			searchParams.delete('editTransaction');
			setSearchParams(searchParams);
		}
	};

	return (
		<Sheet open={isSheetOpen} onOpenChange={handleOpenChange}>
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

				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList variant="line">
						<TabsTrigger value="Expense">Expense</TabsTrigger>
						<TabsTrigger value="Income">Income</TabsTrigger>
					</TabsList>

					<TabsContent value="Expense">
						<TransactionForm
							type="Expense"
							initialData={initialData}
							setSheetOpen={handleOpenChange}
						/>
					</TabsContent>
					<TabsContent value="Income">
						<TransactionForm
							type="Income"
							initialData={initialData}
							setSheetOpen={handleOpenChange}
						/>
					</TabsContent>
				</Tabs>
			</SheetContent>
		</Sheet>
	);
};

export default TransactionSheet;
