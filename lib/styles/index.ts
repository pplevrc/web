import { definePreset } from "@pandacss/dev";
import defu from "defu";
import * as recipes from "./recipes";
import * as animations from "./tokens/animations";
import * as colors from "./tokens/colors";
import * as dimensions from "./tokens/dimensions";
import * as transforms from "./tokens/transforms";
import * as typographies from "./tokens/typography";
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
    recipes,
  },
  conditions: {
    extend: {
      hover: ["@media (any-hover: hover) and (any-pointer: fine)", "&:hover"],
      // FIXME: breakpoints は px 指定を rem に変えてくるため, 独自で指定
      pc: ["@media screen and (min-width: 1440px)"],
      spOnly: ["@media screen and (max-width: 1439.99px)"],
    },
  },
  globalFontface: typographies.globalFontface,
  globalCss: {
    html: {
      "--global-font-body": typographies.globalFontFamily,
    },
  },
  globalVars: defu({}, animations.globalVars),
});
