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
						'Browse exercises targeting specific React concepts: hooks, state, effects, composition, and more. Open any exercise, edit the files directly, and use the built-in tests to check your progress.',
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
						'Exercises marked <strong style="color:#7ab87a">✓</strong> are the ones whose tests currently pass. The completion flag is updated automatically when you run tests, and it is cleared again if you edit the code, fail a test, or hit a compile error.',
					side: 'right',
				},
			},
			{
				element: '#tour-source-tabs',
				popover: {
					title: 'Editable exercise files',
					description:
						"The left-side tabs are fully editable. Update the component, utilities, styles, and any <code>*.test.ts</code> files while keeping the result visible at the same time.",
					side: 'bottom',
					align: 'start',
				},
			},
			{
				element: '#tour-source-tabs',
				popover: {
					title: 'Built-in tests',
					description:
						'Test files can import a small browser-safe adapter from <code>../../test/vitest-adapter</code>. It intentionally supports a limited API that mimics Vitest rather than the full library.<ul><li><code>describe</code>, <code>it</code>, <code>expect</code>, <code>beforeEach</code></li><li><code>render</code>, <code>renderHook</code>, <code>screen</code></li><li><code>fireEvent</code>, <code>act</code></li></ul>',
					side: 'bottom',
					align: 'start',
				},
			},
			{
				element: '#tour-preview-panel',
				popover: {
					title: 'Preview and feedback',
					description: 'The right-side preview panel renders the exercise live in the browser as you edit. Use the test badge above the editor to run checks and inspect the detailed test results drawer.',
					side: 'left',
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
