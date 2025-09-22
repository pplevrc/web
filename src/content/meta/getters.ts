import { getCollection } from "astro:content";
import type { Meta } from "./types";

/**
 * メタデータを取得する
 * @returns
 */
export async function getMeta(): Promise<Meta> {
  const collection = await getCollection("meta");

  const meta = collection[0]?.data;

  if (!meta) {
    throw new Error("Meta not found");
  }

  return meta;
}
