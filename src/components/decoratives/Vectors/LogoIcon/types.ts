import type { SocialLinkType } from "@lib/contents/commons/SocialLink";

export type LogoIconType = SocialLinkType;

export type CommonLogoIconType = ("x" | "youtube") & LogoIconType;

export type OptionalLogoIconType = Omit<LogoIconType, CommonLogoIconType> &
  SocialLinkType;

export const commonLogoIconTypes = [
  "x",
  // "youtube",
] as const satisfies CommonLogoIconType[];

const notSupportedLogos = [
  "youtube",
  "skeb",
  "creatia-frontier",
] as const satisfies LogoIconType[];

export function isSupportedLogo(logo: LogoIconType): boolean {
  return !notSupportedLogos.includes(logo);
}
