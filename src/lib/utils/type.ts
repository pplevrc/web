import type { z } from "astro:content";

export function ensureNonNil<T>(
  target: T | null | undefined,
  message?: string,
): T {
  if (target == null) {
    throw new Error(message ?? "Unexpected nil value");
  }
  return target;
}

export function schemaForType<
  T,
  // biome-ignore lint/suspicious/noExplicitAny: 汎用的な関数のため any を許容
  S extends z.ZodType<T, any, any> = z.ZodType<T, any, any>,
>(arg: S): S {
  return arg;
}
