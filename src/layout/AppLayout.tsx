import { useEffect, type ComponentType } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

export type AppPage = {
	id: string;
	label: string;
	Component: ComponentType;
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
			<section className="app-panel app-panel-left">
				<header className="panel-header">
					<p className="panel-eyebrow">Examples</p>
					<h1>Components</h1>
				</header>

				<div className="page-list" role="list" aria-label="Available page components">
					{pages.map((page) => (
						<NavLink
							key={page.id}
							className={({ isActive }) => (isActive ? 'page-item is-active' : 'page-item')}
							to={`/${page.id}`}
						>
							{page.label}
						</NavLink>
					))}
				</div>
			</section>

			<section className="app-panel app-panel-right">
				<header className="panel-header">
					<p className="panel-eyebrow">Preview</p>
					<h2>{activePage?.label ?? 'No component selected'}</h2>
				</header>

				<div className="page-preview">
					<Outlet />
				</div>
			</section>
		</main>
	);
}

export default AppLayout;
