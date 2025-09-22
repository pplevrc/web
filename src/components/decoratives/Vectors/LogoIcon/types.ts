import type { SocialLinkType } from "@content/commons";

export type LogoIconType = SocialLinkType;

export type CommonLogoIconType = ("x" | "youtube") & LogoIconType;

export type OptionalLogoIconType = Omit<LogoIconType, CommonLogoIconType> &
  SocialLinkType;

const notSupportedLogos = [
  "youtube",
  "skeb",
  "creatia-frontier",
] as LogoIconType[];

export function isSupportedLogo(logo: LogoIconType): boolean {
  return !notSupportedLogos.includes(logo);
}
