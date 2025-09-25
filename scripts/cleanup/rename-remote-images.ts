import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import type { AstroIntegration } from "astro";

/**
 * # これは何?
 *
 * astro では remote image を取得してバンドルすると、そのファイル名が "ファイル名_123abc.png" のような文字列になる.
 * ファイル名とは CMS 側にアップロードされた際に保持されるファイル名であり, その文字列に何らかの情報が含まれたままビルドされるのを防ぎたい目的がある.
 *
 * ただ, その仕組みは astro 自身にはないので, vite plugin という形で解決せざるを得ない
 */

const PLUGIN_NAME = "rename-remote-images";

/**
 * すでに Hash 化済みのファイルは 8 文字なので, 競合阻止のために 10 文字にしておく. なんとなくで.
 */
const HASH_PREFIX_LENGTH = 10;

const TEXT_EXTS = new Set([
  ".html",
  ".css",
  ".js",
  ".mjs",
  ".cjs",
  ".map",
  ".xml",
  ".json",
  ".txt",
]);

// "ファイル名_1L73FM.png" を拾う
const REMOTE_FILENAME_REGEX =
  /^(?<prefix>.+?)_(?<hash>[A-Za-z0-9_-]+)\.(?<ext>avif|webp|png|jpe?g|gif|svg)$/i;

// "D8VvBbcs.png" or "D8VvBbcs_10FWgs.png" は拾わない
const HASHED_FILENAME_REGEX =
  /^(?<prefix>[A-Za-z0-9_-]{8,})_(?<hash>[A-Za-z0-9_-]+)?\.(?<ext>avif|webp|png|jpe?g|gif|svg)$/i;

// prefix → hash1（長さはお好みで）
function hashPrefix(prefix: string, len = HASH_PREFIX_LENGTH): string {
  // 文字列の揺れを抑える（全角/結合文字など）
  const normalized = prefix.normalize("NFC").trim();
  // （必要なら小文字化や連続空白の正規化も可）
  return crypto
    .createHash("sha1")
    .update(normalized)
    .digest("base64url")
    .slice(0, len);
}

export function renameRemoteImages(): AstroIntegration {
  return {
    name: PLUGIN_NAME,
    hooks: {
      async "astro:build:done"({ dir, logger }) {
        const root = dir.pathname;
        const assetsDir = path.join(root, "_assets");
        logger.info(`assetsDir: ${assetsDir}`);

        const renameMap = new Map<string, string>();

        async function findTargetAssets(): Promise<string[]> {
          const files = await fs.readdir(assetsDir);

          return files.filter(
            (f) =>
              REMOTE_FILENAME_REGEX.test(f) && !HASHED_FILENAME_REGEX.test(f),
          );
        }

        function findTargetTextFiles(): Promise<string[]> {
          async function walk(targetDir: string): Promise<string[]> {
            const files = [];

            const entries = await fs.readdir(targetDir, {
              withFileTypes: true,
            });
            for (const entry of entries) {
              const p = path.join(targetDir, entry.name);
              if (entry.isDirectory()) {
                files.push(...(await walk(p)));
              } else if (TEXT_EXTS.has(path.extname(p))) {
                files.push(p);
              }
            }

            return files;
          }

          return walk(root);
        }

        async function renameAssets() {
          const files = await findTargetAssets();
          logger.info(`found ${files.length} target assets.`);

          for (const f of files) {
            const m = f.match(REMOTE_FILENAME_REGEX);
            if (!m || !m.groups) continue;

            const { prefix, hash, ext } = m.groups;
            if (!prefix || !hash || !ext) continue;

            const hashedPrefix = hashPrefix(prefix, HASH_PREFIX_LENGTH);

            const newName = `${hashedPrefix}_${hash}.${ext.toLowerCase()}`;
            const oldPath = path.join(assetsDir, f);
            const newPath = path.join(assetsDir, newName);

            logger.info(`rename file ${oldPath} to ${newPath}`);
            await fs.rename(oldPath, newPath);

            // 参照置換用に絶対パスで記録
            renameMap.set(`/_assets/${f}`, `/_assets/${newName}`);

            if (f !== encodeURI(f)) {
              renameMap.set(encodeURI(`/_assets/${f}`), `/_assets/${newName}`);
            }
          }
        }

        async function replaceRefs() {
          if (renameMap.size === 0) return;

          const files = await findTargetTextFiles();
          for (const file of files) {
            let changed = false;
            let raw = await fs.readFile(file, "utf8");
            const beforeLength = raw.length;

            for (const [oldUrl, newUrl] of renameMap) {
              if (raw.includes(oldUrl)) {
                changed = true;
                raw = raw.replaceAll(oldUrl, newUrl);
              }
            }

            if (changed) {
              logger.info(
                `replaced refs in ${file} from ${beforeLength} to ${raw.length}`,
              );
              await fs.writeFile(file, raw);
            }
          }
        }

        await renameAssets();
        logger.info(`renamed ${renameMap.size} image(s).`);

        await replaceRefs();
        logger.info("replaced refs in text files.");
      },
    },
  };
}
