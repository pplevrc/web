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

export function toArrayBuffer(buf: Buffer): ArrayBuffer {
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    // biome-ignore lint/style/noNonNullAssertion: あるのが保証されているため
    view[i] = buf[i]!;
  }
  return ab;
}
