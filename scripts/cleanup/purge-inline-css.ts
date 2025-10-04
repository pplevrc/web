import { readFile, writeFile } from "node:fs/promises";
import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import { globby } from "globby";
import { type HTMLInputElement, Window } from "happy-dom";
import {
  type BuiltinPseudoElement,
  type PseudoClass,
  type PseudoElement,
  type Rule,
  type SelectorComponent,
  type TSPseudoClass,
  transform,
} from "lightningcss";

interface Context {
  window: Window;

  logger: AstroIntegrationLogger;

  filename: string;
  usedIds: Set<string>;
  usedClasses: Set<string>;
  usedTags: Set<string>;

  usedAttributes: Map<string, Set<string>>;

  usedInputTypes: Set<string>;
}

/**
 * 動的に追加されるクラス
 */
const ignoredClassPatterns: (string | RegExp)[] = [/^astro-/];

/**
 * 明らかに使用予定がない pseudo-classes
 */
const unusedPseudoClasses: string[] = [
  /**
   * ":host" .. custom-elements でのみ利用するもののため削除
   */
  "host",
] satisfies (PseudoClass["kind"] | TSPseudoClass["kind"])[];

/**
 * 明らかに使用予定がない bender pseudo-classes
 */
const unusedBenderPseudoClasses: string[] = [
  /**
   * ":-moz-ui-invalid" .. :user-invalid と同等
   */
  "-moz-ui-invalid",
];

/**
 * 明らかに使用予定がない pseudo-elements
 */
const unusedPseudoElements: string[] = [
  /**
   * "backdrop" .. 全画面モードを使用しないため不要
   */
  "backdrop",
  /**
   * "file-selector-button" .. ファイル選択ボタンがそもそも存在しないため不要
   */
  "file-selector-button",
  /**
   * "placeholder" .. フォームの placeholder はそもそも存在しないため不要
   */
  "placeholder",
] satisfies (PseudoElement["kind"] | BuiltinPseudoElement["kind"])[];

/**
 * 明らかに使用予定がない bender pseudo-elements
 */
const unusedBenderPseudoElements: string[] = [
  /**
   * "-webkit-search-cancel-button" .. 検索ボタンがそもそも存在しないため不要
   */
  "-webkit-search-cancel-button",
  /**
   * "-webkit-search-decoration" .. 検索ボタンがそもそも存在しないため不要
   */
  "-webkit-search-decoration",
  /**
   * "-webkit-inner-spin-button" .. 数値入力フィールドのスピナーがそもそも存在しないため不要
   */
  "-webkit-inner-spin-button",
  /**
   * "-webkit-outer-spin-button" .. 数値入力フィールドのスピナーがそもそも存在しないため不要
   */
  "-webkit-outer-spin-button",
];

function toWindow(code: string): Window {
  const window = new Window();
  const document = window.document;
  document.write(code);
  return window;
}

function toContext(
  code: string,
  filename: string,
  logger: AstroIntegrationLogger,
): Context {
  const window = toWindow(code);
  const document = window.document;

  const usedIds = new Set<string>();
  const usedClasses = new Set<string>();
  const usedTags = new Set<string>();
  const usedInputTypes = new Set<string>();
  const usedAttributes = new Map<string, Set<string>>();

  const allElements = document.querySelectorAll("*");
  for (const element of allElements) {
    if (element.id) {
      usedIds.add(element.id);

      if (element.tagName.toLowerCase() === "input") {
        usedInputTypes.add((element as HTMLInputElement).type);
      }
    }
    if (element.className) {
      const classes = element.className.split(" ");
      for (const cls of classes) {
        usedClasses.add(cls);
      }
    }
    usedTags.add(element.tagName.toLowerCase());

    for (const attr of element.attributes) {
      const set = usedAttributes.get(attr.name) ?? new Set<string>();
      set.add(attr.value);
      usedAttributes.set(attr.name, set);
    }
  }

  return {
    window,
    filename,
    usedIds,
    usedClasses,
    usedTags,
    usedInputTypes,
    usedAttributes,
    logger,
  };
}

function transformHTML(context: Context): string {
  const document = context.window.document;

  const styles = document.querySelectorAll("style");
  for (const style of styles) {
    const raw = style.textContent ?? "";

    if (raw.length === 0) {
      continue;
    }

    style.textContent = transformStyle(raw, context);
  }

  return `<!DOCTYPE html>${document.documentElement.outerHTML}`;
}

function transformStyle(raw: string, context: Context): string {
  const { code } = transform({
    filename: `${context.filename}--inline-css`,
    code: Buffer.from(raw) as unknown as Uint8Array,
    minify: true,
    unusedSymbols: ["--made-with-panda"],

    visitor: {
      Rule: {
        style(rule) {
          purgeStyle(rule, context);
          return rule;
        },
      },
    },
  });

  context.logger.info(
    `shrinked ${context.filename} styles from ${raw.length} to ${code.length} (${(code.length / raw.length) * 100}%)`,
  );
  return code.toString();
}

function purgeStyle(rule: Rule & { type: "style" }, context: Context) {
  rule.value.selectors = rule.value.selectors
    .map((selectors) => translateSelector(selectors, context))
    .filter((s) => s.length > 0);
}

/**
 * 最上段にくるセレクターのみを確認し、それが使われているかどうかを確認する
 */
function translateSelector(
  selectors: SelectorComponent[],
  context: Context,
): SelectorComponent[] {
  const { usedIds, usedClasses, usedTags } = context;
  const selector = selectors[0];

  if (!selector) {
    return [];
  }

  if (selector.type === "id") {
    return usedIds.has(selector.name) ? selectors : [];
  }

  if (selector.type === "class") {
    if (
      ignoredClassPatterns.some((pattern) =>
        typeof pattern === "string"
          ? pattern === selector.name
          : pattern.test(selector.name),
      )
    ) {
      return selectors;
    }

    return usedClasses.has(selector.name) ? selectors : [];
  }

  if (selector.type === "type" && selector.name !== "input") {
    return usedTags.has(selector.name) ? selectors : [];
  }

  if (selector.type === "type" && selector.name === "input") {
    // FOR DEBUG
    return selectors;
  }

  if (selector.type === "pseudo-element") {
    return translatePseudoElementSelector(selectors);
  }

  if (selector.type === "pseudo-class") {
    return translatePseudoClassSelector(selectors, context);
  }

  if (selector.type === "attribute") {
    return translateAttributeSelector(selectors, context);
  }

  return selectors;
}

/**
 * セレクターが擬似要素 ("::before") の場合
 */
// @ts-expect-error
function translatePseudoElementSelector(
  selectors: SelectorComponent[],
): SelectorComponent[] {
  const selector = selectors[0];

  // fallback
  if (!selector || selector.type !== "pseudo-element") {
    return selectors;
  }

  if (unusedPseudoElements.includes(selector.kind)) {
    return [];
  }

  if (selector.kind === "custom") {
    return unusedBenderPseudoElements.includes(selector.kind) ? [] : selectors;
  }

  return selectors;
}

/**
 * セレクターが擬似クラス (":hover") の場合
 */
// @ts-expect-error
function translatePseudoClassSelector(
  selectors: SelectorComponent[],
  context: Context,
): SelectorComponent[] {
  const selector = selectors[0];

  // fallback
  if (!selector || selector.type !== "pseudo-class") {
    return selectors;
  }

  // :where(.foo, .bar) のようなケース
  if (selector.kind === "where") {
    selector.selectors = selector.selectors
      .map((selector) => translateSelector(selector, context))
      .filter((s) => s.length > 0);
  }

  if (selector.kind === "custom") {
    return !unusedBenderPseudoClasses.includes(selector.kind) ? selectors : [];
  }

  return !unusedPseudoClasses.includes(selector.kind) ? selectors : [];
}

/**
 * セレクターが属性 ([hoge]) のような場合
 */
// @ts-expect-error
function translateAttributeSelector(
  selectors: SelectorComponent[],
  { usedAttributes }: Context,
): SelectorComponent[] {
  const selector = selectors[0];

  // fallback
  if (!selector || selector.type !== "attribute") {
    return selectors;
  }

  // [hoge] のようなケース
  if (selector.operation === undefined) {
    return usedAttributes.has(selector.name) ? selectors : [];
  }

  // [hoge=bar] のようなケース
  // TODO: 現状不要のため対応しない
  return selectors;
}

async function transformPurgeInlineCss(
  filepath: string,
  logger: AstroIntegrationLogger,
): Promise<void> {
  const code = await readFile(filepath, "utf-8");

  const context = toContext(code, filepath, logger);
  const transformed = transformHTML(context);

  logger.info(
    `shrinked ${context.filename} from ${code.length} to ${transformed.length} (${(transformed.length / code.length) * 100}%)`,
  );
  await writeFile(filepath, transformed);
}

async function traverseIndexHTML(distDir: URL): Promise<string[]> {
  const files = await globby("**/*.html", {
    cwd: distDir,
    absolute: true,
  });

  return files;
}

/**
 * 完成品の HTML に含まれる inline-css を最適化する. 具体的には以下をやる
 * - 未使用の attribute を削除する
 * - 未使用の class を削除する
 * - 未使用の id を削除する
 * - 未使用の tag を削除する
 * - 明らかに使う予定のない pseudo-element を削除する
 * - 明らかに使う予定のない pseudo-class を削除する
 */
export function purgeInlineCss(): AstroIntegration {
  return {
    name: "purge-inline-css",
    hooks: {
      "astro:build:done": async (options) => {
        // biome-ignore lint/style/noNonNullAssertion: 常にある
        const files = await traverseIndexHTML(options.dir!);

        await Promise.all(
          files.map((file) => transformPurgeInlineCss(file, options.logger)),
        );
      },
    },
  };
}
