import { memoize } from "@lib/utils/cache";
import type { SocialLink } from "../commons/SocialLink";
import { ppleSocialLinks } from "./__mock__/social";

export const fetchOfficialSocialLinks = memoize(
  async (): Promise<SocialLink[]> => {
    // 本来は API からデータを取得する
    return ppleSocialLinks;
  },
);
