import type { SocialLink } from "@/lib/contents/commons/SocialLink";

export const ppleSocialLinks = [
  {
    type: "x",
    url: new URL("https://x.com/pplevrc"),
    description: "ロリっ子喫茶ぷぷりえ公式Xアカウント",
  },
  {
    type: "youtube",
    url: new URL("https://www.youtube.com/@pplech"),
    description:
      "ロリっ子喫茶ぷぷりえ公式 YouTube チャンネル | ぷぷりえちゃんねる",
  },
  {
    type: "pixiv-booth",
    url: new URL("https://pple.booth.pm/"),
    description: "ロリっ子喫茶ぷぷりえ公式 Booth ストア",
  },
] as const satisfies SocialLink[];

Object.freeze(ppleSocialLinks);
