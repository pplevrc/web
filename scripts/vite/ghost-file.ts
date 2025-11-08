import type { PluginOption } from "./type.js";

const VIRTUAL_PREFIX = "virtual:";

const VIRTUAL_MODULE_ID = "ghost-file";

const RESOLVED_PREFIX = `\0${VIRTUAL_PREFIX}${VIRTUAL_MODULE_ID}:`;

/**
 * Vite の画像プラグインが先に処理してしまうのを防ぐため、
 * 拡張子の直後（クエリパラメータの前）にサフィックスを追加
 * (例: `.webp` → `.webp_ghost`, `.webp?raw` → `.webp_ghost?raw`)
 */
const SUFFIX = "_ghost-file";

/**
 * 開発モード・本番ビルド時に明らかに存在しないファイルが明確に分かるが、ロジック上 `import` 文を書かざるを得ない場合，明示的に `undefined` を返すことでビルドエラーを回避する.
 * 具体例として, `*.generated.dev.h264.mp4` のようなファイルは本番ビルドにおいては存在しない. 本番ビルドにおいては, *.genereated.dev.* を対象として回避する.
 *
 * ※ ファイルが存在したとしても明示的に `undefined` を返すバーチャルファイルに置き換えるため, 注意.
 *
 * @param filter フィルター関数
 * @returns
 */
export function ghostFile(filter: (id: string) => boolean): PluginOption {
  return {
    name: "virtual-dev-assets",
    enforce: "pre",
    resolveId(source) {
      if (filter(source)) {
        // クエリパラメータを分離
        const queryIndex = source.indexOf("?");
        const basePath =
          queryIndex !== -1 ? source.slice(0, queryIndex) : source;
        const query = queryIndex !== -1 ? source.slice(queryIndex) : "";

        // 拡張子の直後にサフィックスを挿入
        return `${RESOLVED_PREFIX}${basePath}${SUFFIX}${query}`;
      }

      return null;
    },
    async load(id) {
      if (!id.startsWith(RESOLVED_PREFIX)) {
        return null;
      }

      return "export default undefined";
    },
  };
}
