import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import styles from './ExerciseViewer.module.css';

type Props = {
	exerciseId: string;
	component: ComponentType;
	sourceFiles: Record<string, string>;
};

function getLanguage(filename: string) {
	if (filename.endsWith('.tsx')) return 'tsx';
	if (filename.endsWith('.ts')) return 'typescript';
	if (filename.endsWith('.css')) return 'css';
	if (filename.endsWith('.jsx')) return 'jsx';
	if (filename.endsWith('.js')) return 'javascript';
	return 'text';
}

function sortFiles(files: [string, string][]): [string, string][] {
	return [...files].sort(([a], [b]) => {
		if (a.endsWith('Page.tsx')) return -1;
		if (b.endsWith('Page.tsx')) return 1;
		return a.localeCompare(b);
	});
}

function ExerciseViewer({ exerciseId, component: Component, sourceFiles }: Props) {
	const tabMemory = useRef<Record<string, string>>({});
	const [activeTab, setActiveTab] = useState('__preview__');

	useEffect(() => {
		setActiveTab(tabMemory.current[exerciseId] ?? '__preview__');
	}, [exerciseId]);

	const handleTabChange = (tab: string) => {
		tabMemory.current[exerciseId] = tab;
		setActiveTab(tab);
	};

	const sortedFiles = sortFiles(Object.entries(sourceFiles));

	return (
		<div className={styles.viewer}>
			<div className={styles.tabBar} role="tablist">
				<button
					role="tab"
					aria-selected={activeTab === '__preview__'}
					className={[styles.tab, activeTab === '__preview__' ? styles.tabActive : ''].join(' ')}
					onClick={() => handleTabChange('__preview__')}
				>
					Preview
				</button>
				{sortedFiles.map(([filename]) => (
					<button
						key={filename}
						role="tab"
						aria-selected={activeTab === filename}
						className={[styles.tab, activeTab === filename ? styles.tabActive : ''].join(' ')}
						onClick={() => handleTabChange(filename)}
					>
						{filename}
					</button>
				))}
			</div>

			<div className={styles.content}>
				{activeTab === '__preview__' ? (
					<div className={styles.preview}>
						<Component />
					</div>
				) : (
					<Highlight
						theme={themes.nightOwl}
						code={sourceFiles[activeTab] ?? ''}
						language={getLanguage(activeTab)}
					>
						{({ className, style, tokens, getLineProps, getTokenProps }) => (
							<pre className={`${className} ${styles.codeBlock}`} style={style}>
								{tokens.map((line, i) => (
									<div key={i} {...getLineProps({ line })}>
										<span className={styles.lineNumber}>{i + 1}</span>
										{line.map((token, key) => (
											<span key={key} {...getTokenProps({ token })} />
										))}
									</div>
								))}
							</pre>
						)}
					</Highlight>
				)}
			</div>
		</div>
	);
}

export default ExerciseViewer;
