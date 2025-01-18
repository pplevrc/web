type BuildUnionZeroToN<
  N extends number,
  Acc extends number[] = [],
> = Acc["length"] extends N
  ? Acc[number] | N
  : BuildUnionZeroToN<N, [...Acc, Acc["length"]]>;

type UnionZeroToN<N extends number> = N extends 0 ? 0 : BuildUnionZeroToN<N>;

/**
 * as const された配列の index として取りうる number literal の union type を返す
 */
export type UnionArrayIndex<A extends unknown[] | readonly unknown[]> = Exclude<
  UnionZeroToN<A["length"]>,
  A["length"]
>;
