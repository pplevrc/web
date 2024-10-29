import type { Token } from "@pandacss/types";

/**
 *
 * @param name (e.g. 4 → 1rem | 16px)
 */
export function toSizingToken(name: number): Token<string> {
	return {
		value: toRem(name),
		description: `The size of ${toRem(name)}`,
	};
}

/**
 *
 * @param name (e.g. 4 -> `1rem`)
 */
export function toRem(name: number): string {
	return `${name / 4}rem`;
}
