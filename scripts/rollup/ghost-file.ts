import type { Plugin as RollupPlugin } from "rollup";

const VIRTUAL_PREFIX = "virtual:";

const VIRTUAL_MODULE_ID = "ghost-file";

const RESOLVED_PREFIX = `\0${VIRTUAL_PREFIX}${VIRTUAL_MODULE_ID}:`;

/**
 * 開発モード・本番ビルド時に明らかに存在しないファイルが明確に分かるが、ロジック上 `import` 文を書かざるを得ない場合，明示的に `undefined` を返すことでビルドエラーを回避する.
 * 具体例として, `*.generated.dev.h264.mp4` のようなファイルは本番ビルドにおいては存在しない. 本番ビルドにおいては, *.genereated.dev.* を対象として回避する.
 *
 * ※ ファイルが存在したとしても明示的に `undefined` を返すバーチャルファイルに置き換えるため, 注意.
 *
 * @param filter フィルター関数
 * @returns
 */
export function ghostFile(filter: (id: string) => boolean): RollupPlugin {
  return {
    name: "virtual-dev-assets",
    resolveId(source) {
      if (filter(source)) {
        return `${RESOLVED_PREFIX}${source}`;
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
