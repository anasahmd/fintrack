import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TransactionContent from './TransactionContent';
import { useMediaQuery } from 'usehooks-ts';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';

const TransactionFormModal = () => {
	const isDesktop = useMediaQuery('(min-width: 768px)');
	const [searchParams, setSearchParams] = useSearchParams();
	const editId = searchParams.get('editTransaction');

	const [isModalOpen, setIsModalOpen] = useState(Boolean(editId) || false);

	useEffect(() => {
		if (editId) {
			setIsModalOpen(true);
		}
	}, [editId]);

	const handleOpenChange = (newOpenState) => {
		setIsModalOpen(newOpenState);

		if (!newOpenState && searchParams.get('editTransaction')) {
			searchParams.delete('editTransaction');
			setSearchParams(searchParams);
		}
	};

	return (
		<div>
			{isDesktop ? (
				<Sheet open={isModalOpen} onOpenChange={handleOpenChange}>
					<SheetTrigger asChild>
						<Button
							variant="outline"
							className="cursor-pointer bg-primary text-primary-foreground"
						>
							Add Transaction
						</Button>
					</SheetTrigger>
					<SheetContent className="w-full h-full p-4 sm:h-screen sm:w-100 sm:max-w-100 overflow-y-auto">
						<SheetHeader className="py-2 px-4 text-xl m-2">
							<SheetTitle>{editId ? 'Edit ' : 'Add '} Transaction</SheetTitle>
						</SheetHeader>
						<TransactionContent setIsModalOpen={setIsModalOpen} />
					</SheetContent>
				</Sheet>
			) : (
				<Drawer open={isModalOpen} onOpenChange={handleOpenChange}>
					<DrawerTrigger asChild>
						<Button>Add Transaction</Button>
					</DrawerTrigger>
					<DrawerContent>
						<TransactionContent setIsModalOpen={setIsModalOpen} />
					</DrawerContent>
				</Drawer>
			)}
		</div>
	);
};

export default TransactionFormModal;
