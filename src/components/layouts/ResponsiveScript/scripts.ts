import {
	PC_VIEWPORT_WIDTH,
	getViewportWidth,
	isSP,
} from "@lib/browsers/breakpoint";

let defaultRootFontSize: number | undefined;

function getRootFontSize(): number {
	if (!defaultRootFontSize) {
		defaultRootFontSize = Number.parseFloat(
			getComputedStyle(document.documentElement).fontSize,
		);
	}

	return defaultRootFontSize;
}

interface CalculateFontSizeOptions {
	defaultRootFontSize?: number;
	viewportWidth?: number;
}

export function calculateRootFontSize({
	defaultRootFontSize = getRootFontSize(),
	viewportWidth = getViewportWidth(),
}: CalculateFontSizeOptions = {}): number {
	return (
		(viewportWidth / PC_VIEWPORT_WIDTH) * defaultRootFontSize * (isSP() ? 3 : 1)
	);
}

export function setRootFontSize(fontSize: number): void {
	document.documentElement.style.fontSize = `${fontSize}px`;
}
