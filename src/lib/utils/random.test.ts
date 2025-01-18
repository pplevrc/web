import { assertType, describe, expect, it } from "vitest";
import { defaultRandom, randomPick, seedRandom } from "./random";

describe("defaultRandom", () => {
  it("should return a random number", () => {
    const random1 = defaultRandom();
    const random1Values = [random1.next(), random1.next(), random1.next()];

    const random2 = defaultRandom();
    const random2Values = [random2.next(), random2.next(), random2.next()];
    expect(random1Values).not.toEqual(random2Values);
  });
});

describe("seedRandom", () => {
  it("should return same randoms when seed is same", () => {
    const random1 = seedRandom("test");
    const random1Values = [
      random1.next(),
      random1.next(),
      random1.next(),
      random1.next(),
      random1.next(),
    ];

    const random2 = seedRandom("test");
    const random2Values = [
      random2.next(),
      random2.next(),
      random2.next(),
      random2.next(),
      random2.next(),
    ];

    const random3 = seedRandom("test2");
    const random3Values = [
      random3.next(),
      random3.next(),
      random3.next(),
      random3.next(),
      random3.next(),
    ];

    expect(random1Values).toEqual(random2Values);
    expect(random1Values).not.toEqual(random3Values);
  });

  it("should return same randoms when seed is same and seed source has full-width characters", () => {
    const random1 = seedRandom("あいうえお");
    const random1Values = [
      random1.next(),
      random1.next(),
      random1.next(),
      random1.next(),
      random1.next(),
    ];

    const random2 = seedRandom("あいうえお");
    const random2Values = [
      random2.next(),
      random2.next(),
      random2.next(),
      random2.next(),
      random2.next(),
    ];

    const random3 = seedRandom("あいう えお");
    const random3Values = [
      random3.next(),
      random3.next(),
      random3.next(),
      random3.next(),
      random3.next(),
    ];

    expect(random1Values).toEqual(random2Values);
    expect(random1Values).not.toEqual(random3Values);
  });
});

describe("randomPick", () => {
  it("should return a value from array", () => {
    const array = [1, 2, 3, 4, 5] as const;
    const random = seedRandom("test");
    const value = randomPick(1, array, random);
    expect(array).toContain(value);
  });

  it("should not change source array after pick", () => {
    const array = [1, 2, 3, 4, 5] as const;
    const random = seedRandom("test");
    randomPick(1, array, random);
    expect(array).toEqual([1, 2, 3, 4, 5]);
  });

  it("should return array when pickCount is greater than 1", () => {
    const array = [1, 2, 3, 4, 5] as const;
    const random = seedRandom("test");

    const values1 = randomPick(1, array, random);
    expect(Array.isArray(values1)).toBe(false);
    assertType<1 | 2 | 3 | 4 | 5>(values1);

    const values2 = randomPick(3, array, random);
    expect(Array.isArray(values2)).toBe(true);
    assertType<(1 | 2 | 3 | 4 | 5)[]>(values2);
  });

  it("should return same reference from array", () => {
    const obj1 = { a: 1 };
    const obj2 = { a: 2 };
    const obj3 = { a: 3 };
    const array = [obj1, obj2, obj3] as const;
    const random = seedRandom("test");
    const picked = randomPick(1, array, random);

    expect(array.some((obj) => Object.is(obj, picked))).toBe(true);
  });

  // 型チェックのみをテストする. 実行するとランタイムエラーになるため, skip する
  it.skip("should type error when pickCount is out of range", () => {
    const array = [1, 2, 3, 4, 5] as const;
    const random = seedRandom("test");
    // @ts-expect-error
    randomPick(6, array, random);

    // @ts-expect-error
    randomPick(-1, array, random);

    // @ts-expect-error
    randomPick(1.5, array, random);
  });

  // 型チェックのみをテストする. 実行するとランタイムエラーになるため, skip する
  it.skip("should return never type when source array is empty", () => {
    const array = [] as const;
    const random = seedRandom("test");
    const values = randomPick(1, array, random);
    assertType<never>(values);
  });
});
