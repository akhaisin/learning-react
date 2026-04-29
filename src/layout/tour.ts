import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export function startTour(navigate: (path: string) => void): void {
	const driverObj = driver({
		showProgress: true,
		animate: true,
		smoothScroll: true,
		steps: [
			{
				popover: {
					title: 'Welcome to the React Kata Playground',
					description:
						'A learning playground built around the <strong>coding kata</strong> technique — a practice method borrowed from martial arts where you repeat small, focused exercises until the concepts become muscle memory.',
				},
			},
			{
				element: '#tour-exercises-btn',
				popover: {
					title: 'Exercise mode',
					description: 'Switch between <strong>Exercises</strong> and <strong>Sandbox</strong> modes here.',
					side: 'bottom',
					align: 'start',
				},
			},
			{
				element: '#tour-nav-list',
				popover: {
					title: 'Exercise list',
					description:
						'Browse exercises targeting specific React concepts: hooks, state, effects, composition, and more. Work through them in order or jump to any topic.',
					side: 'right',
					align: 'start',
				},
			},
			{
				element: '#tour-first-variation-group',
				popover: {
					title: 'Variations',
					description:
						'Some exercises offer multiple <strong>variations</strong> — the same problem solved differently. Each isolates a distinct approach so you can compare trade-offs side by side.',
					side: 'right',
				},
			},
			{
				element: '#tour-first-done',
				popover: {
					title: 'Tracking progress',
					description:
						'Exercises marked <strong style="color:#7ab87a">✓</strong> are ones you have worked through. Set <code>done: true</code> in <code>src/exercises.ts</code> — the single registry where all exercises are defined and tracked.',
					side: 'right',
				},
			},
			{
				element: '#tour-preview-panel',
				popover: {
					title: 'Preview',
					description: 'The <strong>Preview</strong> tab renders your exercise live in the browser.',
					side: 'left',
					align: 'start',
				},
			},
			{
				element: '#tour-source-tabs',
				popover: {
					title: 'Solution source files',
					description:
						"Switch tabs to browse the exercise's source files — shown read-only with full syntax highlighting.",
					side: 'bottom',
					align: 'start',
				},
			},
			{
				element: '#tour-sandbox-btn',
				popover: {
					title: 'Sandbox',
					description:
						'A live editor where you can freely experiment with React code and see results instantly — no setup needed.',
					side: 'bottom',
					align: 'start',
					nextBtnText: 'Open Sandbox →',
					onNextClick: () => {
						navigate('/sandbox');
						setTimeout(() => driverObj.moveNext(), 400);
					},
				},
			},
			{
				element: '#tour-sandbox-tab-tsx',
				popover: {
					title: 'Sandbox.tsx',
					description: 'Write TypeScript + JSX here. Changes compile live with a short debounce.',
					side: 'bottom',
				},
			},
			{
				element: '#tour-sandbox-tab-css',
				popover: {
					title: 'Sandbox.module.css',
					description:
						"Write styles here. They're injected into the page and scoped to your component via a CSS module proxy.",
					side: 'bottom',
				},
			},
			{
				element: '#tour-sandbox-preview',
				popover: {
					title: 'Live preview',
					description: 'Your component renders here as you type. Errors are shown in place of the preview.',
					side: 'left',
					doneBtnText: 'Start coding!',
				},
			},
		],
	});

	driverObj.drive();
}
