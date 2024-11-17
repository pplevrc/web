/**
 *
 * @param arg
 * @returns
 */
export function ensureNonNull<T>(arg: T | null | undefined): T {
	if (arg === null || arg === undefined) {
		throw new Error("Unexpected null or undefined");
	}
	return arg;
}

export const UXGA_WIDTH = 1600;

export const SVGA_WIDTH = 800;
