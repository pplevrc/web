import { ensureNotNil, parseIntFromString, pipe } from "./commons";
import type {
  CropOptions,
  OutlineOptions,
  PickedCustomImageTransform,
} from "./types";

const cropPathMap = {
  "crop.t": "top",
  "crop.l": "left",
  "crop.w": "width",
  "crop.h": "height",
} as const satisfies Record<string, keyof CropOptions>;

const outlinePathMap = {
  "outline.t": "thickness",
  "outline.b": "blurSigma",
  "outline.c": "color",
} as const satisfies Record<string, keyof OutlineOptions>;

type Parser<T = unknown> = (value: string | null) => T;

const cropParseMap = {
  top: parseIntFromString,
  left: parseIntFromString,
  width: pipe(ensureNotNil, parseIntFromString),
  height: pipe(ensureNotNil, parseIntFromString),
} as const satisfies Record<keyof CropOptions, Parser>;

const outlineParseMap = {
  thickness: ensureNotNil as Parser,
  blurSigma: parseIntFromString,
  color: ensureNotNil as Parser,
} as const satisfies Record<keyof OutlineOptions, Parser>;

export function configToSearchParams({
  crop,
  outline,
}: PickedCustomImageTransform): URLSearchParams {
  const params = new URLSearchParams();

  if (crop) {
    for (const [key, value] of Object.entries(cropPathMap)) {
      if (crop[value]) {
        params.set(key, crop[value].toString());
      }
    }
  }

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
    if (key in cropPathMap) {
      const cropKey = cropPathMap[key as keyof typeof cropPathMap];
      const parser = cropParseMap[cropKey];

      // biome-ignore lint/suspicious/noExplicitAny: 動的な処理のため any で回避せざるを得ない
      const crop = config.crop ?? ({} as Record<string, any>);
      crop[cropKey] = parser(value);
      config.crop = crop as CropOptions;
    }

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
