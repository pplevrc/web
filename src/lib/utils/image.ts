import { PC_VIEWPORT_WIDTH } from "../browsers/breakpoint";

const REM_TO_PX_IN_VIEWPORT_WIDE_PC = 32;

/**
 *
 * @param rem
 * @returns
 */
export function remToSizePercent(rem: number): number {
  const result = (rem * REM_TO_PX_IN_VIEWPORT_WIDE_PC) / PC_VIEWPORT_WIDTH / 2;
  return Number(result.toFixed(2));
}
