/**
 * try-catch block with fallback
 * @param func
 * @param fallback
 */
export function tryFallback<T>(func: () => T, fallback: T | (() => T)): T;

/**
 * try-catch block with fallback
 * @param func
 * @param fallback
 */
export function tryFallback<T>(
  func: () => Promise<T>,
  fallback: T | (() => T),
): Promise<T>;

export function tryFallback(
  func: () => unknown | Promise<unknown>,
  fallback: unknown | (() => unknown),
): unknown | Promise<unknown> {
  try {
    return func();
  } catch (error) {
    if (typeof fallback === "function") {
      return fallback();
    }
    return fallback;
  }
}
