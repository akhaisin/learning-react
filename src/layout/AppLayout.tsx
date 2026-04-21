import { useEffect, type ComponentType } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';

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
	const selectedPageId = location.pathname.replace(/^\//, '');
	const activePage = pages.find((page) => page.id === selectedPageId) ?? pages[0];

	useEffect(() => {
		if (!activePage?.id) {
			return;
		}

		onSelectedPageChange(activePage.id);
	}, [activePage?.id, onSelectedPageChange]);

	return (
		<main className="app-shell">
			<PanelGroup orientation="horizontal" className="app-panels">
				<Panel defaultSize={28} minSize={15} className="app-panel app-panel-left">
					<header className="panel-header">
						<h1>Exercises</h1>
					</header>

					<div className="page-list" role="list" aria-label="Available page components">
						{pages.map((page) => (
							<NavLink
								key={page.id}
								className={({ isActive }) =>
									['page-item', isActive ? 'is-active' : '', page.done ? 'is-done' : 'is-pending'].join(' ')
								}
								to={`/${page.id}`}
							>
								<span className="page-item-number">{String(page.number).padStart(2, '0')}</span>
								<div className="page-item-body">
									<div className="page-item-top">
										<span className="page-item-label">{page.label}</span>
										{page.done && <span className="page-item-check" aria-hidden="true">✓</span>}
									</div>
									{page.tags.length > 0 && (
										<div className="page-item-tags" aria-label="Topics">
											{page.tags.map((tag) => (
												<span key={tag} className="page-item-tag">{tag}</span>
											))}
										</div>
									)}
								</div>
							</NavLink>
						))}
					</div>
				</Panel>

				<PanelResizeHandle className="resize-handle" />

				<Panel defaultSize={72} minSize={30} className="app-panel app-panel-right">
					<header className="panel-header">
						<h2>{activePage?.label ?? 'No component selected'}</h2>
					</header>

					<div className="page-preview">
						<Outlet />
					</div>
				</Panel>
			</PanelGroup>

			<a
				className="repo-link"
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
		</main>
	);
}

export default AppLayout;
