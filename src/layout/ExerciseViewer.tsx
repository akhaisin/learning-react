import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import styles from './ExerciseViewer.module.css';

type Props = {
	exerciseId: string;
	component: ComponentType;
	sourceFiles: Record<string, string>;
};

const JS_EXT = javascript({ jsx: true, typescript: true });
const CSS_EXT = css();

function getExtensions(filename: string) {
	if (filename.endsWith('.css')) return [CSS_EXT];
	return [JS_EXT];
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
			<div id="tour-source-tabs" className={styles.tabBar} role="tablist">
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
					<CodeMirror
						value={sourceFiles[activeTab] ?? ''}
						extensions={getExtensions(activeTab)}
						theme={oneDark}
						readOnly
						height="100%"
						style={{ height: '100%' }}
					/>
				)}
			</div>
		</div>
	);
}

export default ExerciseViewer;
