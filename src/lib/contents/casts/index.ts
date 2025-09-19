import { site } from "astro:config/server";
import { fetchCastsFromApi } from "@lib/remote/casts";
import { memoize } from "@lib/utils/cache";
import { USE_MOCK } from "@lib/utils/env";

import { createMockCasts } from "./__mock__";
import {
  type Avatar,
  type AvatarImageIndex,
  type AvatarIndex,
  avatarImageIndexDefault,
} from "./avatar";
import {
  type Cast,
  type CastMeta,
  type FetchedCast,
  assertCasts,
} from "./types";

export { avatarImageIndexDefault } from "./avatar";
export type {
  Avatar,
  AvatarImages,
  AvatarIndex,
  AvatarImageIndex,
} from "./avatar";
export type { Cast, CastProfile, VRChatProfile } from "./types";

/**
 *
 */
export const fetchCasts = memoize(async (): Promise<Cast[]> => {
  if (USE_MOCK) {
    return createMockCasts();
  }

  const result = await fetchCastsFromApi();
  assertCasts(result);
  return Promise.all(result.map(fixCast));
});

/**
 *
 */
export const fetchCastNickNames = memoize(async (): Promise<string[]> => {
  const casts = await fetchCasts();
  return casts.map((cast) => cast.profile.nickname);
});

/**
 *
 * @param cast
 * @returns
 */
async function fixCast(cast: FetchedCast): Promise<Cast> {
  return cast as Cast;
}

/**
 *
 */
export const fetchCast = memoize(async (nickname: string): Promise<Cast> => {
  const casts = await fetchCasts();
  const cast = casts.find((cast) => cast.profile.nickname === nickname);

  if (!cast) {
    throw new Error(`Cast "${nickname}" not found`);
  }

  return cast;
});

/**
 *
 */
export const fetchNextCast = memoize(
  async (nickname: string): Promise<Cast> => {
    const casts = await fetchCasts();
    const currentIndex = casts.findIndex(
      (cast) => cast.profile.nickname === nickname,
    );

    const nextIndex = (currentIndex + 1) % casts.length;

    const result = casts[nextIndex];

    if (!result) {
      throw new Error("[Illegal State] Next cast not found");
    }

    return result;
  },
);

/**
 *
 */
export const fetchPrevCast = memoize(
  async (nickname: string): Promise<Cast> => {
    const casts = await fetchCasts();
    const currentIndex = casts.findIndex(
      (cast) => cast.profile.nickname === nickname,
    );

    const prevIndex = (currentIndex - 1 + casts.length) % casts.length;

    const result = casts[prevIndex];

    if (!result) {
      throw new Error("[Illegal State] Previous cast not found");
    }

    return result;
  },
);

/**
 *
 */
export const fetchAvatar = memoize(
  async ({
    nickname,
    index = avatarImageIndexDefault.index,
  }: AvatarIndex): Promise<Avatar> => {
    const cast = await fetchCast(nickname);
    const avatar = cast.avatars[index];

    if (!avatar) {
      throw new Error(`Avatar "${nickname}[${index}]" not found`);
    }

    return avatar;
  },
);

/**
 *
 */
export const fetchAvatarImage = memoize(
  async ({
    nickname,
    index = avatarImageIndexDefault.index,
    expression = avatarImageIndexDefault.expression,
  }: AvatarImageIndex): Promise<string | ImageMetadata> => {
    const avatar = await fetchAvatar({ nickname, index });

    return avatar.images[expression];
  },
);

/**
 *
 */
export function toCastMeta(cast: Cast): CastMeta {
  return {
    nickname: cast.profile.nickname,
    vrchat: cast.vrchat,
    profilePage: new URL(`/casts/${cast.profile.nickname}`, site),
  };
}
