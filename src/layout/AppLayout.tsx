import { useEffect, useRef, useState, type ComponentType } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import styles from './AppLayout.module.css';

export type AppPage = {
	id: string;
	label: string;
	done: boolean;
	number: number;
	tags: string[];
	Component: ComponentType;
	sourceFiles: Record<string, string>;
};

type AppLayoutProps = {
	pages: AppPage[];
	onSelectedPageChange: (id: string) => void;
};

function AppLayout({ pages, onSelectedPageChange }: AppLayoutProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const selectedPageId = location.pathname.replace(/^\//, '');
	const isSandbox = selectedPageId === 'sandbox';
	const activePage = pages.find((page) => page.id === selectedPageId);
	const lastExerciseId = useRef(pages[0]?.id ?? '');
	const [helpOpen, setHelpOpen] = useState(false);

	useEffect(() => {
		if (!isSandbox && activePage) {
			lastExerciseId.current = activePage.id;
			onSelectedPageChange(activePage.id);
		}
	}, [isSandbox, activePage, onSelectedPageChange]);

	const panelTitle = isSandbox ? 'Sandbox' : (activePage?.label ?? '');

	return (
		<main className={styles['app-shell']}>
			<PanelGroup orientation="horizontal" className={styles['app-panels']}>
				<Panel defaultSize={28} minSize={15} className={`${styles['app-panel']} ${styles['app-panel-left']}`}>
					<header className={styles['panel-header']}>
						<div className={styles['mode-toggle']}>
							<button
								className={[styles['mode-btn'], !isSandbox ? styles['mode-btn-active'] : ''].join(' ')}
								onClick={() => navigate(lastExerciseId.current)}
							>
								Exercises
							</button>
							<button
								className={[styles['mode-btn'], isSandbox ? styles['mode-btn-active'] : ''].join(' ')}
								onClick={() => navigate('/sandbox')}
							>
								Sandbox
							</button>
						</div>
					</header>

					<div className={styles['page-list']} role="list" aria-label="Available page components">
						{pages.map((page) => (
							<NavLink
								key={page.id}
								className={({ isActive }) =>
									[
										styles['page-item'],
										isActive && !isSandbox ? styles['is-active'] : '',
										page.done ? styles['is-done'] : styles['is-pending'],
									].join(' ')
								}
								to={`/${page.id}`}
							>
								<span className={styles['page-item-number']}>{String(page.number).padStart(2, '0')}</span>
								<div className={styles['page-item-body']}>
									<div className={styles['page-item-top']}>
										<span className={styles['page-item-label']}>{page.label}</span>
										{page.done && <span className={styles['page-item-check']} aria-hidden="true">✓</span>}
									</div>
									{page.tags.length > 0 && (
										<div className={styles['page-item-tags']} aria-label="Topics">
											{page.tags.map((tag) => (
												<span key={tag} className={styles['page-item-tag']}>{tag}</span>
											))}
										</div>
									)}
								</div>
							</NavLink>
						))}
					</div>
				</Panel>

				<PanelResizeHandle className={styles['resize-handle']} />

				<Panel defaultSize={72} minSize={30} className={`${styles['app-panel']} ${styles['app-panel-right']}`}>
					<header className={styles['panel-header']}>
						<h2>{panelTitle}</h2>
					</header>

					<div className={styles['page-preview']}>
						<Outlet />
					</div>
				</Panel>
			</PanelGroup>

			<a
				className={styles['repo-link']}
				href="https://github.com/akhaisin/learning-react"
				target="_blank"
				rel="noreferrer"
				aria-label="Open project repository on GitHub"
				title="GitHub repository"
			>
				<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<path d="M12 0.5C5.65 0.5 0.5 5.65 0.5 12c0 5.08 3.29 9.39 7.86 10.91 0.58 0.11 0.79-0.25 0.79-0.56 0-0.28-0.01-1.18-0.01-2.15-3.2 0.7-3.88-1.35-3.88-1.35-0.52-1.33-1.28-1.69-1.28-1.69-1.05-0.71 0.08-0.69 0.08-0.69 1.16 0.08 1.77 1.2 1.77 1.2 1.04 1.77 2.71 1.26 3.37 0.96 0.1-0.75 0.41-1.26 0.74-1.56-2.56-0.29-5.25-1.28-5.25-5.73 0-1.26 0.45-2.29 1.19-3.09-0.12-0.29-0.51-1.46 0.11-3.05 0 0 0.97-0.31 3.18 1.18a11.04 11.04 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18 0.62 1.59 0.23 2.76 0.11 3.05 0.74 0.8 1.19 1.83 1.19 3.09 0 4.46-2.69 5.43-5.26 5.72 0.42 0.36 0.79 1.06 0.79 2.14 0 1.55-0.01 2.79-0.01 3.17 0 0.31 0.21 0.68 0.8 0.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35 0.5 12 0.5z" />
				</svg>
			</a>

			<button
				className={styles['help-btn']}
				onClick={() => setHelpOpen(true)}
				aria-label="About this app"
				title="About"
			>
				<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
				</svg>
			</button>

			{helpOpen && (
				<div className={styles['modal-overlay']} onClick={() => setHelpOpen(false)}>
					<div className={styles['modal']} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="help-title">
						<button className={styles['modal-close']} onClick={() => setHelpOpen(false)} aria-label="Close">
							<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
								<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
							</svg>
						</button>
						<h2 id="help-title">About this app</h2>
						<p>
							This is a React learning playground built around the <strong>coding kata</strong> technique — a practice method borrowed from martial arts where you repeat small, focused exercises until the concepts become muscle memory.
						</p>
						<h3>How it works</h3>
						<ul>
							<li><strong>Exercises</strong> — a curated list of React kata, each targeting a specific concept: hooks, state, effects, composition, and more. Work through them in order or jump to any topic.</li>
							<li><strong>Sandbox</strong> — a live editor where you can freely experiment with React code and see the result instantly, without any setup.</li>
						</ul>
						<h3>The kata mindset</h3>
						<p>
							Each exercise is intentionally small. The goal is not to build features but to deeply understand one idea at a time. Return to the same kata on different days — clarity comes from repetition, not just completion.
						</p>
						<p>
							Exercises marked with <span style={{ color: '#7ab87a', fontWeight: 600 }}>✓</span> are ones you have worked through. To mark an exercise as done, set its <code>done</code> flag to <code>true</code> in <code>src/exercises.ts</code> — that is the single registry where all exercises are defined and tracked. There is no wrong order — follow your curiosity.
						</p>
					</div>
				</div>
			)}
		</main>
	);
}

export default AppLayout;
