import { ensureNotNil, parseIntFromString } from "./commons";
import type { OutlineOptions, PickedCustomImageTransform } from "./types";

const outlinePathMap = {
  "outline.t": "thickness",
  "outline.b": "blurSigma",
  "outline.c": "color",
} as const satisfies Record<string, keyof OutlineOptions>;

type Parser<T = unknown> = (value: string | null) => T;

const outlineParseMap = {
  thickness: ensureNotNil as Parser,
  blurSigma: parseIntFromString,
  color: ensureNotNil as Parser,
} as const satisfies Record<keyof OutlineOptions, Parser>;

export function configToSearchParams({
  outline,
}: PickedCustomImageTransform): URLSearchParams {
  const params = new URLSearchParams();

  if (outline) {
    for (const [key, value] of Object.entries(outlinePathMap)) {
      if (outline[value]) {
        params.set(key, outline[value].toString());
      }
    }
  }

  return params;
}

export function searchParamsToConfig(
  params: URLSearchParams,
): PickedCustomImageTransform {
  const config: Partial<PickedCustomImageTransform> = {};

  for (const [key, value] of params.entries()) {
    if (key in outlinePathMap) {
      const outlineKey = outlinePathMap[key as keyof typeof outlinePathMap];
      const parser = outlineParseMap[outlineKey];

      // biome-ignore lint/suspicious/noExplicitAny: 動的な処理のため any で回避せざるを得ない
      const outline = config.outline ?? ({} as Record<string, any>);
      outline[outlineKey] = parser(value);
      config.outline = outline as OutlineOptions;
    }
  }

  return config;
}
