export type IconType =
  | "flower"
  | "flower-outline"
  | "plum"
  | "cherry-blossom"
  | "teacup"
  | "teapot"
  | "pancake";

export type PpleIconType = IconType;

export type OptionalIconType = Omit<IconType, PpleIconType>;

export const ppleIconTypes = [
  "flower",
  "flower-outline",
  "plum",
  "cherry-blossom",
  "teacup",
  "teapot",
  "pancake",
] as const satisfies PpleIconType[];
