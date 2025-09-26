import type { Plugin as RollupPlugin } from "rollup";
import { analyzeVideoMediaType } from "./internals/mediainfo.js";

const TARGET_SUFFIX = "?mediaType";

const VIRTUAL_PREFIX = "virtual:";

const VIRTUAL_MODULE_ID = "extract-media-type";

const RESOLVED_PREFIX = `\0${VIRTUAL_PREFIX}${VIRTUAL_MODULE_ID}:`;

function hasQuery(id: string): boolean {
  return id.endsWith(TARGET_SUFFIX);
}

/**
 *
 * @param id (e.x. `@assets/videos/top-pc.generated.dev.h264.mp4?mediaType`)
 * @returns
 */
function isTargetExtensions(id: string): boolean {
  return /\.(webm|mp4|avi|mov|mkv)(?:\?mediaType)?$/i.test(id);
}

/**
 *
 * @param id
 * @returns
 */
function extractFilePath(id: string): string {
  return id.replace(TARGET_SUFFIX, "").replace(RESOLVED_PREFIX, "");
}

/**
 * ビデオ系拡張子のファイルを import する際に、 suffix を `?mediaType` とすることで, そのビデオに最適な MediaType を取得する
 * MediaType の判断には FileRead が必要だが, ビルド処理中に node api でファイルを読み込む際のパス解決が, 実行環境によって異なるため, その回避策として vite で事前処理する方針を取っている
 */
export function videoMediaInfoPlugin(): RollupPlugin {
  return {
    name: "video-media-info",
    resolveId(source) {
      if (hasQuery(source) && isTargetExtensions(source)) {
        return `${RESOLVED_PREFIX}${extractFilePath(source)}`;
      }

      return null;
    },
    async load(id) {
      if (!id.startsWith(RESOLVED_PREFIX)) {
        return null;
      }

      const filePath = extractFilePath(id);

      // エイリアスを解決してから解析
      const resolvedId = await this.resolve(filePath);
      if (!resolvedId) {
        throw new Error(`Could not resolve ${filePath}`);
      }

      // メディア情報を解析してタイプのみ返す
      const mediaType = await analyzeVideoMediaType(resolvedId.id);

      return `export default ${JSON.stringify(mediaType)}`;
    },
  };
}
