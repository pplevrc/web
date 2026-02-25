export type IconType = PpleIconType | LucideIconType;

export type PpleIconType =
  | "flower"
  | "flower-outline"
  | "plum"
  | "cherry-blossom"
  | "teacup"
  | "teapot"
  | "pancake";

export type LucideIconType =
  | "lucide-globe"
  | "lucide-copyright"
  | "lucide-cookie";

export const ppleIconType = [
  "flower",
  "flower-outline",
  "plum",
  "cherry-blossom",
  "teacup",
  "teapot",
  "pancake",
] as const satisfies IconType[];

export const defaultIconType = [
  ...ppleIconType,
  "lucide-cookie",
] satisfies IconType[];

export type OptionalIconType = Omit<IconType, (typeof ppleIconType)[number]>;
