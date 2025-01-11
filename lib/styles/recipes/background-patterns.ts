import { defineRecipe } from "@pandacss/dev";
import defu from "defu";
import { colorNames } from "../tokens/colors";

export const bgCheckeredPattern = defineRecipe({
  className: "background-checkered-pattern",
  base: {
    bgSize: "[calc(5rem * sqrt(2)) calc(5rem * sqrt(2))]",
    bgPosition: `[${[
      ...Array(4).fill("0 calc(-1.25rem * sqrt(2))"),
      ...Array(4).fill("calc(2.5rem * sqrt(2)) calc(1.25rem * sqrt(2))"),
      ...Array(4).fill("0 calc(1.25rem * sqrt(2))"),
      ...Array(4).fill("calc(2.5rem * sqrt(2)) calc(-1.25rem * sqrt(2))"),
    ].join(",")}]`,
  },
  variants: {
    color: defu(
      {},
      ...colorNames.map((colorName) => ({
        [colorName]: {
          bgColor: `{colors.${colorName}.100}`,
          bgImage: `[${[
            ...["45deg", "135deg", "-45deg", "-135deg"].map(
              (deg) =>
                `linear-gradient(${deg}, {colors.${colorName}.50} 12.5%, transparent 12.5%)`,
            ),
            ...["45deg", "135deg", "-45deg", "-135deg"].map(
              (deg) =>
                `linear-gradient(${deg}, {colors.${colorName}.50} 12.5%, transparent 12.5%)`,
            ),
            ...["45deg", "135deg", "-45deg", "-135deg"].map(
              (deg) =>
                `linear-gradient(${deg}, {colors.${colorName}.200} 12.5%, transparent 12.5%)`,
            ),
            ...["45deg", "135deg", "-45deg", "-135deg"].map(
              (deg) =>
                `linear-gradient(${deg}, {colors.${colorName}.200} 12.5%, transparent 12.5%)`,
            ),
          ].join(",")}]`,
        },
      })),
    ),
  },
});
