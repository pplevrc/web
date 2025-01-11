import { ensureNonNil } from "./type";

export function randomPick<T>(array: T[], pickCount: 1): T;

export function randomPick<T>(array: T[], pickCount: number): T[];

export function randomPick<T>(array: T[], pickCount: number): T | T[] {
  const result: T[] = [];
  for (let i = 0; i < pickCount; i++) {
    const index = Math.floor(Math.random() * array.length);
    result.push(ensureNonNil(array[index]));
    array.splice(index, 1);
  }

  if (pickCount === 1) {
    return ensureNonNil(result[0]);
  }
  return result;
}
