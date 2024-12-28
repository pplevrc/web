type Awaitable<T> = T | Promise<T>;

type CachableFunction<T> = (...args: unknown[]) => Awaitable<T>;

const cacheMap = new WeakMap<CachableFunction<unknown>, unknown>();

export function cache<T, F extends CachableFunction<T>>(fn: F): F {
	return ((...args: unknown[]) => {
		if (!cacheMap.has(fn)) {
			const result = fn(...args);
			cacheMap.set(fn, result);
			return result;
		}
		return cacheMap.get(fn);
	}) as F;
}
