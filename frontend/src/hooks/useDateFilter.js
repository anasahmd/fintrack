import {
	endOfMonth,
	format,
	startOfMonth,
	startOfYear,
	subMonths,
} from 'date-fns';
import { useSearchParams } from 'react-router-dom';

export function useDateFilter() {
	const [searchParams, setSearchParams] = useSearchParams();
	const now = new Date();

	const range = searchParams.get('range') || 'thisMonth';

	const getDates = () => {
		switch (range) {
			case 'lastMonth': {
				const lastMonth = subMonths(now, 1);
				return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
			}
			case 'last6Months':
				return { from: subMonths(now, 6), to: now };
			case 'thisYear':
				return { from: startOfYear(now), to: now };
			case 'custom':
				return {
					from: new Date(searchParams.get('from') || now),
					to: new Date(searchParams.get('to') || now),
				};
			case 'thisMonth':
			default:
				return { from: startOfMonth(now), to: endOfMonth(now) };
		}
	};

	const { from, to } = getDates();

	const setPreset = (newRange) => {
		setSearchParams({ range: newRange }, { replace: true });
	};

	const setCustomRange = (newFrom, newTo) => {
		setSearchParams(
			{
				range: 'custom',
				from: format(newFrom, 'yyyy-MM-dd'),
				to: format(newTo, 'yyyy-MM-dd'),
			},
			{ replace: true },
		);
	};

	return { from, to, range, setPreset, setCustomRange };
}
