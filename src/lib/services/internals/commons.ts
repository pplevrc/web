export function parseIntFromString(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }
  return Number.parseInt(value);
}

export function ensureNotNil<T>(value: T | null | undefined): T {
  if (!value) {
    throw new Error("Value is required");
  }
  return value;
}

type PipeFunction<T, U> = (input: T) => U;

export function pipe<T, U>(fn: PipeFunction<T, U>): PipeFunction<T, U>;
export function pipe<T, U, V>(
  fn1: PipeFunction<T, U>,
  fn2: PipeFunction<U, V>,
): PipeFunction<T, V>;
export function pipe<T, U, V, W>(
  fn1: PipeFunction<T, U>,
  fn2: PipeFunction<U, V>,
  fn3: PipeFunction<V, W>,
): PipeFunction<T, W>;
export function pipe<T, U, V, W, X>(
  fn1: PipeFunction<T, U>,
  fn2: PipeFunction<U, V>,
  fn3: PipeFunction<V, W>,
  fn4: PipeFunction<W, X>,
): PipeFunction<T, X>;
export function pipe<T, U>(
  // biome-ignore lint/suspicious/noExplicitAny: 動的な処理のため any で回避せざるを得ない
  ...fns: PipeFunction<any, any>[]
): PipeFunction<T, U>;

// biome-ignore lint/suspicious/noExplicitAny: 動的な処理のため any で回避せざるを得ない
export function pipe(...fns: PipeFunction<any, any>[]): PipeFunction<any, any> {
  return (value) => {
    return fns.reduce((acc, fn) => fn(acc), value);
  };
}
