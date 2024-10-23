import type { Token } from "@pandacss/types";

/**
 *
 * @param name (e.g. 4 → 1rem | 16px)
 */
export function toSizingToken(name: number): Token<string> {
	const remSize = name / 4;
	return {
		value: `${remSize}rem`,
		description: `The size of ${remSize}rem`,
	};
}
