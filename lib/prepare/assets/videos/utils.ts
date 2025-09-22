/**
 *
 * @param arg
 * @returns
 */
export function ensureNonNil<T>(
  arg: T | null | undefined,
  msg = "Unexpected null or undefined",
): T {
  if (arg === null || arg === undefined) {
    throw new Error(msg);
  }
  return arg;
}

export const isDev = process.env["NODE_ENV"] !== "production";

export const UXGA_WIDTH = 1600;

export const SVGA_WIDTH = 800;
