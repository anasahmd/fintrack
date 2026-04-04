import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import TransactionForm from './TransactionForm';

const TransactionContent = ({ setIsModalOpen }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const editId = searchParams.get('editTransaction');

	const { items: transactions } = useSelector((state) => state.transactions);

	const editTransactionData = transactions.find(
		(transaction) => transaction.id === editId,
	);

	const [activeTab, setActiveTab] = useState(
		editTransactionData?.type || 'Expense',
	);

	useEffect(() => {
		if (editTransactionData) {
			setActiveTab(editTransactionData.type);
		} else {
			setActiveTab('Expense');
		}
	}, [editTransactionData]);

	return (
		<Tabs
			className="pt-0 overflow-y-auto no-scrollbar mt-6 md:mt-0 pb-6"
			value={activeTab}
			onValueChange={setActiveTab}
		>
			<TabsList className="sticky top-0 z-10 w-full">
				<TabsTrigger value="Expense" className="cursor-pointer">
					Expense
				</TabsTrigger>
				<TabsTrigger value="Income" className="cursor-pointer">
					Income
				</TabsTrigger>
			</TabsList>

			<TabsContent value="Expense" className="px-1">
				<TransactionForm
					type="Expense"
					initialData={editTransactionData}
					setIsModalOpen={setIsModalOpen}
				/>
			</TabsContent>
			<TabsContent value="Income" className="px-1">
				<TransactionForm
					type="Income"
					initialData={editTransactionData}
					setIsModalOpen={setIsModalOpen}
				/>
			</TabsContent>
		</Tabs>
	);
};

export default TransactionContent;
