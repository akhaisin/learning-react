import React, { useEffect, useRef, useState, type ComponentType } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useHostSync, MeflyNavReceiver } from 'mefly-nav';
import useLocalStorage from '../hooks/useLocalStorage';
import { startTour } from './tour';
import 'mefly-nav/style.css';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import styles from './AppLayout.module.css';

export type AppVariation = {
	id: string;
	label: string;
	done: boolean;
	Component: ComponentType;
	sourceFiles: Record<string, string>;
};

export type AppPage = {
	id: string;
	label: string;
	done: boolean;
	number: number;
	tags: string[];
	// Single implementation
	Component?: ComponentType;
	sourceFiles?: Record<string, string>;
	// Or variations
	variations?: AppVariation[];
};

type AppLayoutProps = {
	pages: AppPage[];
	onSelectedPageChange: (id: string) => void;
};

function AppLayout({ pages, onSelectedPageChange }: AppLayoutProps) {
	useHostSync(['https://mefly.dev', 'https://www.mefly.dev']);
	const [isEmbedded] = useState(() => window.parent !== window);
	const location = useLocation();
	const navigate = useNavigate();
	const selectedPath = location.pathname.replace(/^\//, '');
	const isSandbox = selectedPath === 'sandbox';

	const [activePageId, activeVariationId] = selectedPath.split('/');
	const activePage = pages.find((page) => page.id === activePageId);

	const lastExerciseId = useRef(
		pages[0]?.variations ? `${pages[0].id}/${pages[0].variations[0].id}` : (pages[0]?.id ?? ''),
	);
	const listRef = useRef<HTMLDivElement>(null);
	const [helpSeen, setHelpSeen] = useLocalStorage('learning-react.v1.helpSeen', false);
	const firstVariationId = pages.find((p) => p.variations)?.id;
	const firstDoneId = pages.find((p) => p.done)?.id;

	useEffect(() => {
		const list = listRef.current;
		if (!list) return;
		const activeEl = list.querySelector<HTMLElement>(`.${styles['is-active']}`);
		activeEl?.scrollIntoView({ block: 'center', behavior: 'smooth' });
	}, [activePageId, activeVariationId]);

	useEffect(() => {
		if (!isSandbox && activePage) {
			const fullPath = activeVariationId ? `${activePageId}/${activeVariationId}` : activePageId;
			lastExerciseId.current = fullPath;
			onSelectedPageChange(fullPath);
		}
	}, [isSandbox, activePage, activePageId, activeVariationId, onSelectedPageChange]);

	const activeVariation = activePage?.variations?.find((v) => v.id === activeVariationId);
	const panelTitle = isSandbox
		? 'Sandbox'
		: activeVariation
			? `${activePage?.label} · ${activeVariation.label}`
			: (activePage?.label ?? '');

	return (
		<main className={`${styles['app-shell']}${isEmbedded ? ` ${styles['is-embedded']}` : ''}`}>
			<PanelGroup orientation="horizontal" className={styles['app-panels']}>
				<Panel defaultSize={28} minSize={15} className={`${styles['app-panel']} ${styles['app-panel-left']}`}>
					<header className={styles['panel-header']}>
						<div className={styles['mode-toggle']}>
							<button
								id="tour-exercises-btn"
								className={[styles['mode-btn'], !isSandbox ? styles['mode-btn-active'] : ''].join(' ')}
								onClick={() => navigate(lastExerciseId.current)}
							>
								Exercises
							</button>
							<button
								id="tour-sandbox-btn"
								className={[styles['mode-btn'], isSandbox ? styles['mode-btn-active'] : ''].join(' ')}
								onClick={() => navigate('/sandbox')}
							>
								Sandbox
							</button>
						</div>
					</header>

					<div ref={listRef} id="tour-nav-list" className={styles['page-list']} role="list">
						{pages.map((page) => {
							if (page.variations) {
								const isGroupActive = page.id === activePageId && !isSandbox;
								return (
									<div
										key={page.id}
										id={page.id === firstVariationId ? 'tour-first-variation-group' : page.id === firstDoneId ? 'tour-first-done' : undefined}
										role="listitem"
										className={[
											styles['page-item'],
											isGroupActive ? styles['is-active'] : '',
											page.done ? styles['is-done'] : styles['is-pending'],
										].join(' ')}
										onClick={() => navigate(`/${page.id}/${page.variations![0].id}`)}
									>
										<span className={styles['page-item-number']}>{String(page.number).padStart(2, '0')}</span>
										<div className={styles['page-item-cols']}>
											<div className={styles['page-item-col-main']}>
												<div className={styles['page-item-top']}>
													<span className={styles['page-item-label']}>{page.label}</span>
													{page.done && <span className={styles['page-item-check']} aria-hidden="true">✓</span>}
												</div>
												<div className={styles['page-item-variations']}>
													{page.variations.map((variation) => (
														<NavLink
															key={variation.id}
															to={`/${page.id}/${variation.id}`}
															onClick={(e) => e.stopPropagation()}
															className={({ isActive }) =>
																[
																	styles['variation-link'],
																	isActive && !isSandbox ? styles['variation-link-active'] : '',
																	variation.done ? '' : styles['variation-pending'],
																].join(' ')
															}
														>
															<span className={styles['variation-dot']} aria-hidden="true" />
															<span>{variation.label}</span>
															{variation.done && <span className={styles['page-item-check']} aria-hidden="true">✓</span>}
														</NavLink>
													))}
												</div>
											</div>
											{page.tags.length > 0 && (
												<div className={styles['page-item-col-tags']} aria-label="Topics">
													{page.tags.map((tag) => (
														<span key={tag} className={styles['page-item-tag']}>{tag}</span>
													))}
												</div>
											)}
										</div>
									</div>
								);
							}

							return (
								<NavLink
									key={page.id}
									id={page.id === firstDoneId ? 'tour-first-done' : undefined}
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
							);
						})}
					</div>
				</Panel>

				<PanelResizeHandle className={styles['resize-handle']} />

				<Panel defaultSize={72} minSize={30} className={`${styles['app-panel']} ${styles['app-panel-right']}`}>
					<header className={styles['panel-header']}>
						<h2>{panelTitle}</h2>
					</header>

					<div id="tour-preview-panel" className={styles['page-preview']}>
						<Outlet />
					</div>
				</Panel>
			</PanelGroup>

			<MeflyNavReceiver
				trustedOrigins={['https://mefly.dev', 'https://www.mefly.dev']}
				activationMode="hover"
				style={{
					left: '1rem',
					bottom: '1rem',
					'--mefly-nav-trigger-size': '2.15rem',
					'--mefly-nav-trigger-bg': 'rgba(255, 252, 245, 0.92)',
					'--mefly-nav-trigger-bg-hover': 'rgba(240, 236, 226, 0.97)',
					'--mefly-nav-trigger-color': '#403929',
					'--mefly-nav-trigger-border': '1px solid #d8cfbf',
					'--mefly-nav-trigger-shadow': '0 8px 20px rgba(31, 41, 51, 0.12)',
					'--mefly-nav-trigger-hover-transform': 'translateY(-1px)',
				} as React.CSSProperties}
			/>

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
				className={[styles['help-btn'], !helpSeen ? styles['help-btn-glow'] : ''].join(' ')}
				onClick={() => {
					setHelpSeen(true);
					if (isSandbox) {
						navigate('/' + lastExerciseId.current);
						setTimeout(() => startTour(navigate), 300);
					} else {
						startTour(navigate);
					}
				}}
				title="Tour"
			>
				<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
				</svg>
			</button>
		</main>
	);
}

export default AppLayout;
