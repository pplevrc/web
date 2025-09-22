import { type CollectionEntry, getCollection, getEntry } from "astro:content";
import type { Avatar } from "./avatar";

/**
 * リストに並べた際の次のエントリーを取得する
 */
export async function getNextEntry(
  id: string,
): Promise<CollectionEntry<"casts">> {
  const casts = await getCollection("casts");

  const currentIndex = casts.findIndex((cast) => cast.id === id);

  const nextIndex = (currentIndex + 1) % casts.length;

  const nextCast = casts[nextIndex];

  if (!nextCast) {
    throw new Error("Next cast not found");
  }

  return nextCast;
}

/**
 * リストに並べた際の前のエントリーを取得する
 */
export async function getPrevEntry(
  id: string,
): Promise<CollectionEntry<"casts">> {
  const casts = await getCollection("casts");

  const currentIndex = casts.findIndex((cast) => cast.id === id);

  const prevIndex = (currentIndex - 1 + casts.length) % casts.length;

  const prevCast = casts[prevIndex];

  if (!prevCast) {
    throw new Error("Prev cast not found");
  }

  return prevCast;
}

/**
 * アバターのインデックス
 */
type AvatarIndex = {
  nickname: string;
  index: number;
};

/**
 * アバターを取得する
 */
export async function getAvatar({
  nickname,
  index,
}: AvatarIndex): Promise<Avatar> {
  const cast = await getEntry("casts", nickname);

  if (!cast) {
    throw new Error(`Cast "${nickname}" not found`);
  }

  const avatar = cast.data.avatars[index];

  if (!avatar) {
    throw new Error(`Avatar "${nickname}" not found`);
  }

  return avatar;
}
