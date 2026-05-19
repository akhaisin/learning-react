import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
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
	const fileRank: Record<string, number> = {
		'Page.tsx': 0,
		'Component.tsx': 1,
		'utils.ts': 2,
		'Component.module.css': 3,
	};

	return [...files].sort(([a], [b]) => (fileRank[a] ?? 99) - (fileRank[b] ?? 99));
}

function ExerciseViewer({ exerciseId, component: Component, sourceFiles }: Props) {
	const tabMemory = useRef<Record<string, string>>({});
	const sortedFiles = sortFiles(Object.entries(sourceFiles));
	const [activeTab, setActiveTab] = useState('');

	useEffect(() => {
		const rememberedTab = tabMemory.current[exerciseId];
		const fallbackTab = sortedFiles[0]?.[0] ?? '';
		const nextTab = rememberedTab && sourceFiles[rememberedTab] ? rememberedTab : fallbackTab;
		setActiveTab(nextTab);
	}, [exerciseId, sortedFiles, sourceFiles]);

	const handleTabChange = (tab: string) => {
		tabMemory.current[exerciseId] = tab;
		setActiveTab(tab);
	};

	return (
		<PanelGroup orientation="horizontal" className={styles.viewer}>
			<Panel defaultSize={48} minSize={25} className={styles.sourcePanel}>
				<div id="tour-source-tabs" className={styles.tabBar} role="tablist">
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
					{activeTab ? (
						<CodeMirror
							value={sourceFiles[activeTab] ?? ''}
							extensions={getExtensions(activeTab)}
							theme={oneDark}
							readOnly
							height="100%"
							style={{ height: '100%' }}
						/>
					) : (
						<div className={styles.emptyState}>No source files available.</div>
					)}
				</div>
			</Panel>

			<PanelResizeHandle className={styles.resizeHandle} />

			<Panel id="tour-preview-panel" defaultSize={52} minSize={25} className={styles.previewPanel}>
				<div className={styles.preview}>
					<Component />
				</div>
			</Panel>
		</PanelGroup>
	);
}

export default ExerciseViewer;
