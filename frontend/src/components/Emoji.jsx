import twemoji from '@twemoji/api';
import { useMemo } from 'react';

const Emoji = ({ text, className = '' }) => {
	const parsedEmoji = useMemo(
		() =>
			twemoji.parse(text, {
				folder: 'svg',
				ext: '.svg',
			}),
		[text],
	);

	return (
		<span
			className={`inline-flex items-center justify-center ${className}`}
			dangerouslySetInnerHTML={{ __html: parsedEmoji }}
		/>
	);
};

export default Emoji;
