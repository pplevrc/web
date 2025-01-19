import { defineRecipe } from "@pandacss/dev";
import defu from "defu";
import { colorTokenNames } from "../tokens/colors";

/**
 * content 側で "latte.lite" のような色トークン名を指定する箇所がある.
 * これを background-color に変換するためのレシピ
 * ※ PandsCSS はランタイムの変数を CSS に変換できないため, Recipe 化している
 */
export const contentBgColor = defineRecipe({
  className: "runtimeBgColor",
  variants: {
    color: defu(
      {},
      ...colorTokenNames
        .filter((colorTokenName) => !colorTokenName.endsWith(".bg"))
        .map((colorTokenName) => ({
          [colorTokenName]: {
            bg: `{colors.${colorTokenName}`,
          },
        })),
    ),
  },
});
