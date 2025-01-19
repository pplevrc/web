import { z } from "astro:content";
import { schemaForType } from "@lib/utils/type";
import type { ColorToken } from "@styles/tokens";

type PickToken<T extends string> = T extends `${infer _}.${infer Type}`
  ? Type extends `${number}`
    ? never
    : T extends `colorPalette.${infer _}`
      ? never
      : T
  : never;

type OmitBG<T extends ColorToken> = T extends `${infer _}.bg` ? never : T;

type OmitSemantic<T extends ColorToken> = T extends `${infer R}.${infer _}`
  ? R
  : never;

export type ColorTheme = OmitBG<PickToken<ColorToken>>;

export type ColorThemeBase = OmitSemantic<PickToken<ColorTheme>>;

const colorNames = [
  "smoke",
  "olive",
  "berry",
  "honey",
  "soda",
  "rose",
  "matcha",
  "latte",
  "lavender",
  "carrot",
  "ice",
  "mint",
] as const satisfies ColorThemeBase[];

export function pickColorBase(theme: ColorTheme): ColorThemeBase {
  const colorName = colorNames.find((name) => theme.startsWith(name));

  if (!colorName) {
    throw new Error(`Invalid color theme: ${theme}`);
  }

  return colorName;
}

export const colorThemeSchema = schemaForType<ColorTheme>(
  z.union([
    z.literal("smoke.lite"),
    z.literal("smoke.regular"),
    z.literal("smoke.deep"),
    z.literal("olive.lite"),
    z.literal("olive.regular"),
    z.literal("olive.deep"),
    z.literal("berry.lite"),
    z.literal("berry.regular"),
    z.literal("berry.deep"),
    z.literal("honey.lite"),
    z.literal("honey.regular"),
    z.literal("honey.deep"),
    z.literal("soda.lite"),
    z.literal("soda.regular"),
    z.literal("soda.deep"),
    z.literal("rose.lite"),
    z.literal("rose.regular"),
    z.literal("rose.deep"),
    z.literal("matcha.lite"),
    z.literal("matcha.regular"),
    z.literal("matcha.deep"),
    z.literal("latte.lite"),
    z.literal("latte.regular"),
    z.literal("latte.deep"),
    z.literal("lavender.lite"),
    z.literal("lavender.regular"),
    z.literal("lavender.deep"),
    z.literal("carrot.lite"),
    z.literal("carrot.regular"),
    z.literal("carrot.deep"),
    z.literal("ice.lite"),
    z.literal("ice.regular"),
    z.literal("ice.deep"),
    z.literal("mint.lite"),
    z.literal("mint.regular"),
    z.literal("mint.deep"),
  ]),
);
