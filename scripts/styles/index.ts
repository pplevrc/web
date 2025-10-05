import { definePreset } from "@pandacss/dev";
import { defu } from "defu";
import * as animations from "./tokens/animations.js";
import * as colors from "./tokens/colors.js";
import * as dimensions from "./tokens/dimensions.js";
import * as transforms from "./tokens/transforms.js";
import * as typographies from "./tokens/typography.js";

export default definePreset({
  name: "pple-themes",
  theme: {
    tokens: defu(
      {},
      colors.tokens,
      dimensions.tokens,
      animations.tokens,
      transforms.tokens,
    ),
    semanticTokens: defu(
      {},
      colors.semanticTokens,
      dimensions.semanticTokens,
      animations.semanticTokens,
    ),
    breakpoints: dimensions.breakpoints,
    textStyles: typographies.textStyle,
    keyframes: animations.keyframes,
  },
  conditions: {
    extend: {
      supportHover: ["@media (hover: hover) and (pointer: fine)"],
      hover: [
        "@media (hover: hover) and (pointer: fine)",
        "&:is(:hover, [data-hover])",
      ],
      supportActive: "@media (hover: none) and (pointer: coarse)",
      touchActive: [
        "@media (hover: none) and (pointer: coarse)",
        "&:is(:active, [data-active])",
      ],
      pc: ["@media screen and (width >= 1440px)"],
      spOnly: ["@media screen and (width < 1440px)"],
    },
  },
  globalFontface: typographies.globalFontface,
  globalCss: {
    html: {
      "--global-font-body": typographies.globalFontFamily,
    },
  },
  globalVars: defu({}, animations.globalVars),
  staticCss: {
    css: [
      {
        properties: {
          colorPalette: colors.colorNames,
        },
      },
    ],
  },
});
