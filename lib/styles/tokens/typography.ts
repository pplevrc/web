import type { TextStyle } from "@/styles/types/composition";
import {
  type TextStyles,
  defineGlobalFontface,
  defineTextStyles,
} from "@pandacss/dev";
import defu from "defu";
import { toRem } from "./commons/dimensions";

type FontSizeSet = [fontSize: number, lineHeight: number];

const sizes = {
  "2xs": [2, 2.5],
  xs: [2, 3],
  sm: [3, 4],
  base: [3.5, 5],
  lg: [4, 7],
  xl: [5, 7],
  "2xl": [6, 8],
  "3xl": [7.5, 9],
  "4xl": [9, 10],
  "5xl": [12, 12],
  "6xl": [15, 15],
  "7xl": [18, 18],
  "8xl": [24, 24],
  "9xl": [32, 32],
} as const satisfies Record<string, FontSizeSet>;

const sizeNames = Object.keys(sizes) as (keyof typeof sizes)[];

function defineTextStyleSet(config: Partial<TextStyle> = {}): TextStyles {
  return defu(
    {},
    ...sizeNames.map((key) => {
      const [fontSize, lineHeight] = sizes[key];

      return {
        [key]: {
          value: {
            fontSize: toRem(fontSize),
            lineHeight: toRem(lineHeight),
            ...config,
          },
        },
      };
    }),
  );
}

export const textStyle = defineTextStyles({
  normal: {
    DEFAULT: defineTextStyleSet({
      fontWeight: 400,
    }),
    bold: defineTextStyleSet({
      fontWeight: 700,
    }),
  },
  decorative: {
    bold: defineTextStyleSet({
      fontFamily: "YasashisaGothic",
    }),
  },
});

export const globalFontface = defineGlobalFontface({
  YasashisaGothic: [
    {
      src: ['url(/public/fonts/YasashisaGothicBold.otf) format("opentype")'],
      fontStyle: "normal",
      fontDisplay: "swap",
    },
  ],
});

export const globalFontFamily =
  '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif';
