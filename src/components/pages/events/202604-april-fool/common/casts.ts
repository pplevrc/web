import ImageHiraxu from "@assets/images/events/202604-april-fool/chara-hiraxu.png";
import ImageOuka from "@assets/images/events/202604-april-fool/chara-ouka.png";
import ImageSao from "@assets/images/events/202604-april-fool/chara-sao.png";
import ImageStora from "@assets/images/events/202604-april-fool/chara-stora.png";

import type { Cast } from "@content/casts";

/**
 * エイプリルフール限定キャスト用データセット
 */
export interface AprilFoolEventMainCast {
  nickname: Cast["profile"]["nickname"];

  image: ImageMetadata;

  themeColor: Cast["themeColor"];

  introduction: Cast["profile"]["introduction"];
}

const APRIL_FOOL_MAIN_CASTS = [
  {
    nickname: "桃小姫ストラ",
    image: ImageStora,
    themeColor: "rose",
    introduction: `
くんくんくん、この匂いは…
期間限定春の特製ぷぷりえスイーツ！🍨✨️
この名探偵からは逃げらないよ〜！
大人しくストラのお口に入ってねっ！
あむっ！おいちい！！🍨💕
`.trim(),
  },
  {
    nickname: "くるりおうか",
    image: ImageOuka,
    themeColor: "berry",
    introduction: `
私だって探偵になれるもん！
普段からみんなのお姉ちゃんだし
皆をリードしてどんな謎も…
…あ、私謎解き苦手だった…
お兄さんお姉さん手伝ってーー！！
`.trim(),
  },
  {
    nickname: "ひらくぅ。",
    image: ImageHiraxu,
    themeColor: "lavender",
    introduction: `
じけんのにおいがする。
じけんのにおいはね。あまいの。
そう、あまいおかしのような。
というわけでおかしたべるね。
これは頭をかいてんさせるためにいるの。
ひらくぅ。がじけんをといちゃうね。
おかしたべたぶんがんばるよ。
`.trim(),
  },
  {
    nickname: "sao*",
    image: ImageSao,
    themeColor: "soda",
    introduction: `
はわわぁ💦 さおちゃんがめいたんていに！？

さおちゃんできるこ！💕 つよいこだもんっ！💪
どんなじけんも さおちゃんかいけつしちゃうもん✨

んー………🌀🌀🌀 さおちゃんわかんなーい…！🥲
え〜〜〜ん！😭😭😭
`.trim(),
  },
] as const satisfies AprilFoolEventMainCast[];

export function loadCasts(): AprilFoolEventMainCast[] {
  return APRIL_FOOL_MAIN_CASTS;
}
