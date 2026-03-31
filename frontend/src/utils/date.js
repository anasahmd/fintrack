import { format, isToday, isYesterday, isThisYear } from 'date-fns';

export const formatTransactionDate = (dateString) => {
	const date = new Date(dateString);

	const time = format(date, 'hh:mm a');

	// Relative formatting for the last 48 hours
	if (isToday(date)) {
		return `Today, ${time}`; // "Today, 03:02 PM"
	}
	if (isYesterday(date)) {
		return `Yesterday, ${time}`; // "Yesterday, 03:02 PM"
	}

	// Current year
	if (isThisYear(date)) {
		return format(date, `dd MMM, '${time}'`); // "21 Sep, 03:02 PM"
	}

	// Past years
	return format(date, `dd MMM yyyy, '${time}'`); // "21 Sep 2025, 03:02 PM"
};
