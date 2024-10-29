export function getViewportWidth(): number {
	return document.documentElement.clientWidth;
}

let defaultRootFontSize: number | undefined;

function getRootFontSize(): number {
	if (!defaultRootFontSize) {
		defaultRootFontSize = Number.parseFloat(
			getComputedStyle(document.documentElement).fontSize,
		);
	}

	return defaultRootFontSize;
}

const PC_VIEWPORT_WIDTH = 1440;

export function calculateRootFontSize(
	viewportWidth: number,
	defaultRootFontSize: number = getRootFontSize(),
): number {
	/**
	 * smartphone viewport
	 * 0 .. 0px
	 * < 1440px .. 32px (x2 of default)
	 * --
	 * pc viewport
	 * 1440px .. 16px (default root font size)
	 * 2880px .. 32px (x2 of default)
	 */
	return (
		(viewportWidth / PC_VIEWPORT_WIDTH) *
		defaultRootFontSize *
		(viewportWidth < PC_VIEWPORT_WIDTH ? 2 : 1)
	);
}

export function setRootFontSize(fontSize: number): void {
	document.documentElement.style.fontSize = `${fontSize}px`;
}
