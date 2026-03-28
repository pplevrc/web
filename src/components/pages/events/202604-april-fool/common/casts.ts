import { getEntry } from "astro:content";
import ImageHiraxu from "@assets/images/events/202604-april-fool/chara-hiraxu.png";
import ImageOuka from "@assets/images/events/202604-april-fool/chara-ouka.png";
import ImageSao from "@assets/images/events/202604-april-fool/chara-sao.png";
import ImageStora from "@assets/images/events/202604-april-fool/chara-stora.png";

import type { Cast } from "@content/casts";

/**
 * エイプリルフール限定キャスト用データセット
 */
export interface AprilFoolEventMainCast {
  id: Cast["vrchat"]["userId"];

  nickname: Cast["profile"]["nickname"];

  image: ImageMetadata;

  themeColor: Cast["themeColor"];

  introduction: Cast["profile"]["introduction"];
}

const APRIL_FOOL_MAIN_CAST_IDS = [
  "桃小姫ストラ",
  "くるりおうか",
  "ひらくぅ。",
  "sao*",
] as const satisfies AprilFoolEventMainCast["id"][];

type MainCastId = (typeof APRIL_FOOL_MAIN_CAST_IDS)[number];

const IMAGE_MAP = {
  桃小姫ストラ: ImageStora,
  くるりおうか: ImageOuka,
  "ひらくぅ。": ImageHiraxu,
  "sao*": ImageSao,
} as const satisfies Record<MainCastId, ImageMetadata>;

export async function loadCasts(): Promise<AprilFoolEventMainCast[]> {
  const casts = [];

  for (const id of APRIL_FOOL_MAIN_CAST_IDS) {
    const { data: cast } = (await getEntry("casts", id)) ?? { data: undefined };
    if (cast) {
      casts.push({
        id: cast.vrchat.userId,
        nickname: cast.profile.nickname,
        image: IMAGE_MAP[id],
        themeColor: cast.themeColor,
        introduction: cast.profile.introduction,
      });
    }
  }

  return casts;
}
