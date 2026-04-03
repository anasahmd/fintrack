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
			<SheetContent className="w-full h-full p-4 sm:h-screen sm:w-100 sm:max-w-100 overflow-y-auto">
				<SheetHeader className="py-2 px-4 text-xl m-2">
					<SheetTitle>{initialData ? 'Edit ' : 'Add '} Transaction</SheetTitle>
				</SheetHeader>

				<Tabs className="pt-0" value={activeTab} onValueChange={setActiveTab}>
					<TabsList variant="line">
						<TabsTrigger value="Expense" className="cursor-pointer">
							Expense
						</TabsTrigger>
						<TabsTrigger value="Income" className="cursor-pointer">
							Income
						</TabsTrigger>
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
