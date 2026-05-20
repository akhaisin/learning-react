export function getVisibleRange(scrollTop: number, rowHeight: number, containerHeight: number, totalItems: number) {
	const startIndex = Math.max(Math.floor(scrollTop / rowHeight), 0);
	const visibleCount = Math.ceil(containerHeight / rowHeight) + 1;
	const endIndex = Math.min(startIndex + visibleCount, totalItems);
	return { startIndex, endIndex };
}
