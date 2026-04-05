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
		// !!! Update the check condition to isLoading from transaction state
		// Until any transaction is loaded, it won't run
		if (transactions.length > 0 && editId && !editTransactionData) {
			setSearchParams(
				(prevParams) => {
					prevParams.delete('editTransaction');
					return prevParams;
				},
				{ replace: true },
			);
			setIsModalOpen(false);
			return;
		}

		if (editTransactionData) {
			setActiveTab(editTransactionData.type);
		} else {
			setActiveTab('Expense');
		}
	}, [
		editId,
		editTransactionData,
		transactions.length,
		setSearchParams,
		setIsModalOpen,
	]);

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
