import { hash } from "ohash";
import type { UnionArrayIndex } from "./arithmetic-types";

export type Randomizer = Generator<number, never, unknown>;

/**
 * Math.random による乱数生成器
 */
export function* defaultRandom(): Randomizer {
  while (true) {
    yield Math.random();
  }
}

const seedCache = new Map<string, number>();

/**
 * シードを指定して乱数生成器を生成
 */
export function* seedRandom(seed: unknown): Randomizer {
  if (seed == null) {
    throw new Error("seed is required");
  }

  // string を hash 化
  const seedHash = hash(seed);

  // hash string の文字コードを整数に変換
  const seedNumberStr = seedHash
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), "");
  const seedNumber = Number(seedNumberStr);

  // ※ AI 生成
  let x = seedNumber;
  while (true) {
    const cached = seedCache.get(seedHash);
    if (cached) {
      x = cached;
    }

    x = (x ^ (x << 13)) >>> 0;
    x = (x ^ (x << 17)) >>> 0;
    x = (x ^ (x << 5)) >>> 0;

    seedCache.set(seedHash, x);

    yield x / 4294967296;
  }
}

/**
 *
 * @param pickCount
 * @param array
 * @param createRandom
 */
export function randomPick<T extends unknown[] | readonly unknown[]>(
  pickCount: 1,
  array: T | T,
  createRandom?: Randomizer,
): T[number];

/**
 *
 * @param pickCount
 * @param array
 * @param createRandom
 */
export function randomPick<T extends unknown[] | readonly unknown[]>(
  pickCount: UnionArrayIndex<T>,
  array: T,
  createRandom?: Randomizer,
): T[number][];

export function randomPick(
  pickCount: number,
  array: unknown[],
  random: Randomizer = defaultRandom(),
): unknown | unknown[] {
  if (pickCount === array.length) {
    return [...array];
  }

  const sourceArray = [...array];

  const result: unknown[] = [];
  for (let i = 0; i < pickCount; i++) {
    if (sourceArray.length === 0) {
      break;
    }

    const index = Math.floor(random.next().value * sourceArray.length);
    result.push(sourceArray[index]);
    sourceArray.splice(index, 1);
  }

  if (pickCount === 1) {
    // biome-ignore lint/style/noNonNullAssertion: あることが保証されている
    return result[0]!;
  }
  return result;
}

/**
 *
 */
export function randomId(): string {
  return hash(Math.random().toString());
}
