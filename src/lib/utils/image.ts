const REM_TO_PX_IN_VIEWPORT_WIDE_PC = 32;

const VIEWPORT_WIDTH_WIDE_PC = 2880;

/**
 *
 * @param rem
 * @returns
 */
export function remToSizePercent(rem: number): number {
  return (rem * REM_TO_PX_IN_VIEWPORT_WIDE_PC) / VIEWPORT_WIDTH_WIDE_PC;
}
