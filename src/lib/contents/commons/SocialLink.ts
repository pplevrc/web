import { z } from "astro:content";
import { schemaForType } from "@/lib/utils/type";
import { retrieveActivityPubSoftwareName } from "./ActivityPub";

type Awaitable<T> = T | Promise<T>;

type SocialLinkURLPattern =
  | RegExp
  | RegExp[]
  | ((url: URL) => Awaitable<boolean>);

interface SocialLinkStrategy {
  type: string;
  urlPatterns: SocialLinkURLPattern;
  replace?: (url: URL) => URL;
}

const socialLinks = [
  /// -----------------------------------------------------------------------------------
  /// VR SNS (VRChat only)
  {
    // e.g. https://vrchat.com/home/user/usr_a6fcfdca-b8d3-4a9e-a061-de2eb2fda98f
    type: "vrchat",
    urlPatterns: /^https:\/\/vrchat\.com\//,
  },

  /// -----------------------------------------------------------------------------------
  /// SNS
  {
    // e.g. https://twitter.com/sotomiti_iroha, https://x.com/sotomiti_iroha
    type: "x",
    urlPatterns: [/^https:\/\/twitter\.com\/[^/]+/, /^https:\/\/x\.com\/[^/]+/],
    // twitter host は x に置き換える
    replace(url) {
      return new URL(
        url.href.replace(/^https:\/\/twitter\.com\//, "https://x.com/"),
      );
    },
  },
  {
    // e.g. https://bsky.app/profile/mewton.jp
    type: "bluesky",
    urlPatterns: /^https:\/\/bluesky/,
  },
  {
    // e.g. https://virtualkemomimi.net/@YTJVDCM
    type: "misskey",
    urlPatterns: async (url) => {
      const software = await retrieveActivityPubSoftwareName(url);
      return software?.toLocaleLowerCase() === "misskey";
    },
  },
  {
    // e.g. https://mstdn.virtecam.net/@YTJVDCM
    type: "mastodon",
    urlPatterns: async (url) => {
      const software = await retrieveActivityPubSoftwareName(url);
      return software?.toLocaleLowerCase() === "mastodon";
    },
  },

  /// -----------------------------------------------------------------------------------
  /// Live Streaming Service
  {
    // e.g. https://www.youtube.com/@sotomiti_iroha
    type: "youtube",
    urlPatterns: [
      /^https:\/\/www\.youtube\.com\//,
      /^https:\/\/m\.youtube\.com\//,
    ],
    replace(url) {
      return new URL(
        url.href.replace(
          /^https:\/\/m\.youtube\.com\//,
          "https://www.youtube.com/",
        ),
      );
    },
  },

  /// -----------------------------------------------------------------------------------
  /// Short Image & Movie Sharing Service
  // e.g. tiktok, instagram, youtube-short

  /// -----------------------------------------------------------------------------------
  /// VR SNS (Non-VRChat)
  // e.g. cluster

  /// -----------------------------------------------------------------------------------
  /// Patrons
  /// e.g. funtia, creatia-frontier
  {
    // e.g. https://www.fanbox.cc/@rikusu3
    type: "pixiv-fanbox",
    urlPatterns: /^https:\/\/www\.fanbox\.cc\//,
  },
  {
    // e.g. https://frontier.creatia.cc/fanclubs/1234
    type: "creatia-frontier",
    urlPatterns: /^https:\/\/frontier\.creatia\.cc\//,
  },

  /// -----------------------------------------------------------------------------------
  /// EC
  {
    // e.g. https://sisters.booth.pm/, https://booth.pm/
    type: "pixiv-booth",
    urlPatterns: /^https:\/\/(.*\.)?booth\.pm\//,
  },

  /// -----------------------------------------------------------------------------------
  /// Commission Service
  {
    // e.g. https://skeb.jp/@rikusu_vrc
    type: "skeb",
    urlPatterns: /^https:\/\/skeb\.jp\//,
  },

  /// -----------------------------------------------------------------------------------
  /// Profile
  {
    // e.g. https://hub.vroid.com/users/4466642
    type: "pixiv-vroid-hub",
    urlPatterns: /^https:\/\/hub\.vroid\.com\//,
  },

  /// -----------------------------------------------------------------------------------
  /// Development Profile
  {
    // e.g. https://github.com/mew-ton
    type: "github",
    urlPatterns: /^https:\/\/github\.com\//,
  },
] as const satisfies SocialLinkStrategy[];

export type SocialLinkType = (typeof socialLinks)[number]["type"] | "other";

export interface SocialLink<T extends SocialLinkType = SocialLinkType> {
  /**
   * @example "youtube"
   */
  type: T;

  /**
   * @example "https://www.youtube.com/channel/@sotomiti_iroha"
   */
  url: URL;

  /**
   * @example "@sotomiti_iroha | 外道いろは　Sotomiti Iroha (YouTube Channel)"
   */
  description: string;
}

export const socialLinkSchema = schemaForType<SocialLink>(
  z.object({
    type: z.union(
      // biome-ignore lint/suspicious/noExplicitAny: 理由がちょっとよくわからなかった
      socialLinks.map(({ type }) => z.literal(type)) as any,
    ) as z.ZodType<SocialLinkType>,
    url: z.any() as z.ZodType<URL>,
    description: z.string(),
  }),
);

/**
 *
 * @param url
 * @returns
 */
export async function detectType(url: URL): Promise<SocialLinkType> {
  // さきに正規表現だけで判定できるものを判定する
  const regexPatternLinks = socialLinks.filter(
    (link): link is typeof link & { urlPatterns: RegExp | RegExp[] } =>
      typeof link.urlPatterns !== "function",
  );

  for (const { type, urlPatterns } of regexPatternLinks) {
    const patterns = Array.isArray(urlPatterns) ? urlPatterns : [urlPatterns];
    for (const pattern of patterns) {
      if (url.href.match(pattern)) {
        return type;
      }
    }
  }

  // 正規表現だけで判定できないものは実際にアクセスして判定する
  const functionPatternLinks = socialLinks.filter(
    (
      link,
    ): link is typeof link & {
      urlPatterns: (url: URL) => Awaitable<boolean>;
    } => typeof link.urlPatterns === "function",
  );

  for (const { type, urlPatterns } of functionPatternLinks) {
    if (await urlPatterns(url)) {
      return type;
    }
  }

  // それ以外は other とする
  return "other";
}

interface SocialLinkOptions {
  url: string;

  userId?: string;

  description: string;
}

/**
 *
 * @param param0
 * @returns
 */
export async function toSocialLink({
  url: urlString,
  description,
}: SocialLinkOptions): Promise<SocialLink> {
  const url = new URL(urlString);
  const type = await detectType(url);

  return {
    type,
    url,
    description,
  };
}

/**
 * socialLinks を表示順の基準として、ソートします
 * @param socialLinks
 * @returns
 */
export function sort(socialLinks: SocialLink[]): SocialLink[] {
  return socialLinks.sort((a, b) => {
    const aIndex = socialLinks.findIndex((link) => link.type === a.type);
    const bIndex = socialLinks.findIndex((link) => link.type === b.type);
    return aIndex - bIndex;
  });
}
