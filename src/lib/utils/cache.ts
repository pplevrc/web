import { hash } from "ohash";
import { ensureNonNil } from "./type";

// biome-ignore lint/suspicious/noExplicitAny: 汎用的な型のため許容
type AnyFunction = (...args: any[]) => any;

const globalCacheMap = new WeakMap<AnyFunction, Map<string, unknown>>();

// const CACHE_DIR = resolve(__dirname, "../../.cache");

interface MemoizeOption {
	debug?: boolean;
}

/**
 * 関数とその入力に対して返り値をキャッシュし, 2回目以降の呼び出しでキャッシュされた値を返す関数を返す.
 * @param fn
 * @returns
 */
export function memoize<F extends AnyFunction>(
	fn: F,
	opt: MemoizeOption = {},
): F {
	return ((...args: unknown[]) => {
		const key = hash(args);

		if (opt.debug) {
			console.log("args", JSON.stringify(args));
			console.log("key", key);
		}

		if (!globalCacheMap.has(fn)) {
			if (opt.debug) {
				console.log("create new cache map");
			}
			globalCacheMap.set(fn, new Map<string, unknown>());
		}

		const cacheMap = ensureNonNil(globalCacheMap.get(fn));
		if (cacheMap.has(key)) {
			if (opt.debug) {
				console.log("cache hit");
				console.log("result (cached)", cacheMap.get(key));
			}
			return cacheMap.get(key);
		}

		const result = fn(...args);

		if (result instanceof Promise) {
			return result.then((value) => {
				cacheMap.set(key, value);
				if (opt.debug) {
					console.log("result", value);
				}
				return value;
			});
		}

		if (opt.debug) {
			console.log("result", result);
		}
		cacheMap.set(key, result);
		return result;
	}) as F;
}
