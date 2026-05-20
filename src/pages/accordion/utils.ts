export type AccordionPanel = {
	id: string;
	title: string;
	content: string;
};

export const defaultPanels: AccordionPanel[] = [
	{
		id: 'html',
		title: 'HTML',
		content: 'Structure content with semantic elements that communicate meaning.',
	},
	{
		id: 'css',
		title: 'CSS',
		content: 'Use CSS Modules to scope styles and keep visual states predictable.',
	},
	{
		id: 'react',
		title: 'React',
		content: 'Let state decide which panel is expanded instead of mutating the DOM directly.',
	},
];
