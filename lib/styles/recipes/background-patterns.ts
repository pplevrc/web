import { defineRecipe } from "@pandacss/dev";
import { type ColorName, colorNames } from "../tokens/colors";

function pxToRem(px: number) {
  return `${px / 16}rem`;
}

function checkeredPattern(colorName: ColorName): string {
  return [
    `repeating-linear-gradient(${[
      "0deg",
      `{colors.${colorName}.100} 0 ${pxToRem(1)}`,
      `{colors.white/50} ${pxToRem(1)} ${pxToRem(21)}`,
      `{colors.${colorName}.100/50} ${pxToRem(21)} ${pxToRem(61)}`,
      `{colors.white/50} ${pxToRem(61)} ${pxToRem(81)}`,
    ].join(",")})`,
    `repeating-linear-gradient(${[
      "90deg",
      `{colors.${colorName}.100} 0 ${pxToRem(1)}`,
      `{colors.white/50} ${pxToRem(1)} ${pxToRem(21)}`,
      `{colors.${colorName}.100/50} ${pxToRem(21)} ${pxToRem(61)}`,
      `{colors.white/50} ${pxToRem(61)} ${pxToRem(81)}`,
    ].join(",")})`,
  ].join(",");
}

function stripePattern(colorName: ColorName | "white"): string {
  const colorToken =
    colorName === "white" ? "{colors.white/60}" : `{colors.${colorName}.bg/60}`;

  return `repeating-linear-gradient(45deg, ${colorToken}, ${colorToken} 16rem, transparent 16rem)`;
}

export const bgPattern = defineRecipe({
  className: "background-pattern",
  compoundVariants: [
    ///
    /// チェック柄
    ...colorNames.map((colorName) => ({
      pattern: "checkered",
      color: colorName,
      css: {
        bg: "white",
        bgImage: checkeredPattern(colorName),
      },
    })),

    ///
    /// ストライプ
    ...colorNames.map((colorName) => ({
      pattern: "stripe",
      color: colorName,
      css: {
        bgImage: stripePattern(colorName),
      },
    })),
    {
      pattern: "stripe",
      color: "white",
      css: {
        bgImage: stripePattern("white"),
      },
    },
  ],
});
