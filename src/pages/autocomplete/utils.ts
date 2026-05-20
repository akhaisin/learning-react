export const suggestions = [
	'Apple',
	'Apricot',
	'Banana',
	'Blackberry',
	'Blueberry',
	'Cherry',
	'Clementine',
	'Grape',
	'Mango',
	'Orange',
];

export function getMatchingSuggestions(query: string) {
	const normalizedQuery = query.trim().toLowerCase();
	if (!normalizedQuery) return [];
	return suggestions.filter((item) => item.toLowerCase().includes(normalizedQuery)).slice(0, 6);
}
