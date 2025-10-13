import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ColorTheme } from "@content/commons";
import { token } from "@styles/tokens";
import { ensureNonNil } from "./type";

/**
 * CSS変数トークンのパターン: `var(--xxxxxx)`
 */
const CSS_VAR_TOKEN_REGEXP = /var\(--(.+)\)/;

/**
 * CSS変数参照のパターン: `var(--variableName)`
 */
const CSS_VAR_REFERENCE_REGEXP = /var\(--([^)]+)\)/;

/**
 * テーマカラーから実際のカラーコード（例: #D8F5EA）を取得
 *
 * @param themeColor カラーテーマ名
 * @returns カラーコード（例: "#D8F5EA"）
 */
export function getColorCode(themeColor: ColorTheme): string {
  const variableName = ensureNonNil(getVariableNameByThemeColor(themeColor));
  return ensureNonNil(getColorCodeByVariableName(variableName));
}

/**
 * テーマカラーからCSS変数名を取得
 *
 * @param themeColor カラーテーマ名
 * @returns CSS変数名（ハイフンなし、例: "czxYnm"）
 */
function getVariableNameByThemeColor(
  themeColor: ColorTheme,
): string | undefined {
  const cssToken = token(`colors.${themeColor}`);
  const match = cssToken.match(CSS_VAR_TOKEN_REGEXP);
  return match?.[1];
}

/**
 * CSS変数名から実際のカラーコードを取得
 *
 * 例:
 * - czxYnm -> ANvmW -> #D8F5EA
 * - ANvmW -> #D8F5EA
 *
 * @param variableName CSS変数名 (ハイフンなし)
 */
function getColorCodeByVariableName(variableName: string): string | undefined {
  // PandaCSSが生成したCSSファイルを読み込み
  const cssContent = getCssContent();
  if (!cssContent) return undefined;

  // CSS変数の値を再帰的に解決
  return resolveCssVariable(variableName, cssContent, new Set());
}

/**
 * CSS変数を再帰的に解決して最終的なカラーコードを取得
 *
 * @param variableName 解決したい変数名（ハイフンなし）
 * @param cssContent CSSファイルの内容
 * @param visited 循環参照チェック用
 * @returns カラーコード（例: "#D8F5EA"）
 */
function resolveCssVariable(
  variableName: string,
  cssContent: string,
  visited: Set<string>,
): string | undefined {
  // 循環参照チェック
  if (visited.has(variableName)) {
    console.warn(
      `Circular reference detected for CSS variable: ${variableName}`,
    );
    return undefined;
  }
  visited.add(variableName);

  // --variableName:value; のパターンをマッチ
  const regex = new RegExp(`--${variableName}:([^;]+);`, "i");
  const match = cssContent.match(regex);

  if (!match) {
    return undefined;
  }

  const value = match[1]?.trim();

  if (!value) {
    return undefined;
  }

  // 値が別のCSS変数を参照している場合 (例: var(--ANvmW))
  const varMatch = value.match(CSS_VAR_REFERENCE_REGEXP);
  if (varMatch) {
    const referencedVar = varMatch[1];
    return referencedVar
      ? resolveCssVariable(referencedVar, cssContent, visited)
      : undefined;
  }

  // カラーコードの場合はそのまま返す
  if (value.startsWith("#") || value.startsWith("rgb")) {
    return value;
  }

  return undefined;
}

/**
 * PandaCSSが生成したCSSファイルの内容を取得（キャッシュ付き）
 */
let cssContentCache: string | null = null;

function getCssContent(): string | null {
  if (cssContentCache !== null) {
    return cssContentCache;
  }

  try {
    // PandaCSSが生成したCSSファイルを読み込み
    // Astroのビルド時に src/styles/styles.css が存在する
    const cssPath = join(process.cwd(), "src/styles/styles.css");
    cssContentCache = readFileSync(cssPath, "utf-8");

    return cssContentCache;
  } catch (error) {
    console.error("Failed to read CSS file:", error);
    return null;
  }
}
