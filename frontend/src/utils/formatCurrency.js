const getBrowserLocale = () => {
	return typeof window !== 'undefined' ? navigator.language : 'en-US';
};

export const formatCurrency = (
	amount,
	currency = 'INR',
	locale = getBrowserLocale(),
) => {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(amount);
};

export const formatCompactCurrency = (
	amount,
	currency = 'INR',
	locale = getBrowserLocale(),
) => {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		notation: 'compact',
		maximumFractionDigits: 1,
	}).format(amount);
};
