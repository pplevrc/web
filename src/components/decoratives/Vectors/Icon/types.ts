export type IconType =
  | "flower"
  | "flower-outline"
  | "plum"
  | "cherry-blossom"
  | "teacup"
  | "teapot"
  | "pancake";

export const iconTypes = [
  "flower",
  "flower-outline",
  "plum",
  "cherry-blossom",
  "teacup",
  "teapot",
  "pancake",
] as const satisfies IconType[];
