import { getEntry } from "astro:content";
import type { Cast } from "@content/casts";

const APRIL_FOOL_MAIN_CAST_IDS: string[] = [
  "桃小姫ストラ",
  "くるりおうか",
  "ひらくぅ。",
  "sao*",
];

export async function loadCasts(): Promise<Cast[]> {
  const casts = [];

  for (const id of APRIL_FOOL_MAIN_CAST_IDS) {
    const { data: cast } = (await getEntry("casts", id)) ?? { data: undefined };
    if (cast) {
      casts.push(cast);
    }
  }

  return casts;
}
