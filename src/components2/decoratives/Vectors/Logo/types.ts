export type LogoType = "pple" | "vrchat";

export type CommonLogoType = LogoType;

export const commonLogoTypes = [
  "pple",
  "vrchat",
] as const satisfies CommonLogoType[];
