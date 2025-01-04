import { hash } from "ohash";
import { ensureNonNil } from "./type";

type Awaitable<T> = T | Promise<T>;

type CachableFunction<T> = (...args: unknown[]) => Awaitable<T>;

const globalCacheMap = new WeakMap<
	CachableFunction<unknown>,
	Map<string, unknown>
>();

// const CACHE_DIR = resolve(__dirname, "../../.cache");

/**
 * 関数とその入力に対して返り値をキャッシュし, 2回目以降の呼び出しでキャッシュされた値を返す関数を返す.
 * @param fn
 * @returns
 */
export function memoize<T, F extends CachableFunction<T>>(fn: F): F {
	return ((...args: unknown[]) => {
		const key = hash(args);

		if (!globalCacheMap.has(fn)) {
			globalCacheMap.set(fn, new Map<string, unknown>());
		}

		const cacheMap = ensureNonNil(globalCacheMap.get(fn));
		if (cacheMap.has(key)) {
			return cacheMap.get(key);
		}

		const result = fn(...args);

		if (result instanceof Promise) {
			return result.then((value) => {
				cacheMap.set(key, value);
				return value;
			});
		}

		cacheMap.set(key, result);
		return result;
	}) as F;
}

// /**
//  * ファイル生成の処理過程において, 生成前ファイルのハッシュ値を元にキャッシュファイルを探す.
//  * @param sourceFile
//  * @param fileNameSuffix
//  * @returns キャッシュファイルのパス. キャッシュファイルが見つからなかった場合は `undefined`.
//  */
// export async function findCacheFile(
// 	sourceFile: Buffer,
// 	fileNameSuffix: string,
// ): Promise<string | undefined> {
// 	const fileHash = hash(sourceFile);
// 	const cachedFileName = `${fileHash}${fileNameSuffix}`;
// 	const cachedFilePath = resolve(CACHE_DIR, cachedFileName);

// 	try {
// 		if (await stat(cachedFilePath)) {
// 			return cachedFilePath;
// 		}
// 	} catch {
// 		// do nothing
// 	}

// 	return undefined;
// }

// /**
//  * ファイル生成の処理過程において, 生成前ファイルのハッシュ値を基準として生成後ファイルをキャッシュする.
//  * @param sourceFile
//  * @param generatedFile
//  * @param fileNameSuffix
//  * @returns キャッシュファイルのパス.
//  */
// export async function cacheGeneratedFile(
// 	sourceFile: Buffer,
// 	generatedFile: Buffer,
// 	fileNameSuffix: string,
// ): Promise<string> {
// 	const fileHash = hash(sourceFile);
// 	const cachedFileName = `${fileHash}${fileNameSuffix}`;
// 	const cachedFilePath = resolve(CACHE_DIR, cachedFileName);

// 	await writeFile(cachedFilePath, new Uint8Array(generatedFile));
// 	return cachedFilePath;
// }
