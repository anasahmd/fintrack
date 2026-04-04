import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TransactionContent from './TransactionContent';
import { useMediaQuery } from 'usehooks-ts';
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerTitle,
	DrawerTrigger,
} from './ui/drawer';

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

		// Removes the query parameter on closing the edit form
		if (!newOpenState && searchParams.get('editTransaction')) {
			setSearchParams(
				(prevParams) => {
					prevParams.delete('editTransaction');
					return prevParams;
				},
				{ replace: true },
			);
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
					<SheetContent className="p-4">
						<SheetHeader className="px-0">
							<SheetTitle className="text-xl">
								{editId ? 'Edit ' : 'Add '} Transaction
							</SheetTitle>
							<SheetDescription className="sr-only">
								Fill out the form below to {editId ? 'edit your' : 'add a new'}{' '}
								transaction.
							</SheetDescription>
						</SheetHeader>
						<TransactionContent setIsModalOpen={setIsModalOpen} />
					</SheetContent>
				</Sheet>
			) : (
				<Drawer open={isModalOpen} onOpenChange={handleOpenChange}>
					<DrawerTrigger asChild>
						<Button className="cursor-pointer bg-primary text-primary-foreground">
							Add Transaction
						</Button>
					</DrawerTrigger>
					<DrawerContent className="p-4">
						<DrawerTitle className="sr-only">
							{editId ? 'Edit ' : 'Add '} Transaction
						</DrawerTitle>
						<DrawerDescription className="sr-only">
							Fill out the form below to {editId ? 'edit your' : 'add a new'}{' '}
							transaction.
						</DrawerDescription>
						<TransactionContent setIsModalOpen={setIsModalOpen} />
					</DrawerContent>
				</Drawer>
			)}
		</div>
	);
};

export default TransactionFormModal;
