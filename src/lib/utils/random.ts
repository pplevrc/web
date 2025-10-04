import { hash as ohash } from "ohash";
import type { UnionArrayIndex } from "./arithmetic-types";

export type Randomizer = Generator<number, never, unknown>;

const isProduction = import.meta.env.MODE === "production";

/**
 * Math.random による乱数生成器
 * 開発時はシードを固定して乱数を生成する
 */
export function* defaultRandom(): Randomizer {
  if (isProduction) {
    while (true) {
      yield Math.random();
    }
  }

  const random = seedRandom("development");
  while (true) {
    yield random.next().value;
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
  const seedNumber = seedHash
    .split("")
    .reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) >>> 0, 0);

  let x = seedNumber;
  while (true) {
    x = (x ^ (x << 13)) >>> 0;
    x = (x ^ (x >> 17)) >>> 0;
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
  array: T,
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

/**
 *
 * @param pickCount
 * @param array
 * @param createRandom
 */
export function randomPick<T>(
  pickCount: number,
  array: T[],
  createRandom?: Randomizer,
): T[];

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
  return hash(Date.now());
}

/**
 * ohash の出力のうち先頭 8 文字のみ切り出す
 * @param source
 */
export function hash(source: unknown): string {
  return ohash(source).slice(0, 8);
}

interface RandomDateOptions {
  start: Date;
  end: Date;
  createRandom?: Randomizer;
}

export function randomDate({ start, end, createRandom }: RandomDateOptions) {
  const random = createRandom ?? defaultRandom();
  const randomValue = random.next().value;
  const timeDiff = end.getTime() - start.getTime();
  const randomTime = start.getTime() + Math.floor(randomValue * timeDiff);
  return new Date(randomTime);
}
