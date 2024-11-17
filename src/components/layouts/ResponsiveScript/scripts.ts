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
	if (isSP()) {
		// smartphone viewport
		// vw 1440px .. 32px
		// vw 412px .. 16px
		// となる式
		// return (viewportWidth / (PC_VIEWPORT_WIDTH - 412) + 2 - 412 / (PC_VIEWPORT_WIDTH - 412) * defaultRootFontSize;
		return (viewportWidth / 1024 + 0.5992217899) * defaultRootFontSize;
	}

	// pc viewport
	// vw 1440px .. 16px
	// vw 2880px .. 32px
	// となる式

	return (viewportWidth / PC_VIEWPORT_WIDTH) * defaultRootFontSize;
}

export function setRootFontSize(fontSize: number): void {
	document.documentElement.style.fontSize = `${fontSize}px`;
}
