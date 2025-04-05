import { memoize } from "@lib/utils/cache";

import { createMockCasts } from "./__mock__";
import {
  type Avatar,
  type AvatarImageIndex,
  type AvatarIndex,
  avatarImageIndexDefault,
} from "./avatar";
import { type Cast, type FetchedCast, assertCasts } from "./types";

export { avatarImageIndexDefault } from "./avatar";
export type {
  Avatar,
  AvatarImages,
  AvatarIndex,
  AvatarImageIndex,
} from "./avatar";
export type { Cast, CastProfile, VRChatProfile } from "./types";

export const fetchCasts = memoize(async (): Promise<Cast[]> => {
  // 本来は API からデータを取得する
  const result = await createMockCasts();

  assertCasts(result);

  return Promise.all(result.map(fixCast));
});

export const fetchCastNickNames = memoize(async (): Promise<string[]> => {
  const casts = await fetchCasts();
  return casts.map((cast) => cast.profile.nickname);
});

async function fixCast(cast: FetchedCast): Promise<Cast> {
  return cast as Cast;
}

export const fetchCast = memoize(async (nickname: string): Promise<Cast> => {
  const casts = await fetchCasts();
  const cast = casts.find((cast) => cast.profile.nickname === nickname);

  if (!cast) {
    throw new Error(`Cast "${nickname}" not found`);
  }

  return cast;
});

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

interface AvatarImage {
  image: string | ImageMetadata;
  height: number;
}

export const fetchAvatarImage = memoize(
  async ({
    nickname,
    index = avatarImageIndexDefault.index,
    type = avatarImageIndexDefault.type,
  }: AvatarImageIndex): Promise<AvatarImage> => {
    const avatar = await fetchAvatar({ nickname, index });

    return {
      image: avatar.images[type],
      height: avatar.height,
    };
  },
);
