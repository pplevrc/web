import { randomColorBase } from "@content/commons";
import { type SocialLink, randomSocialType } from "@content/commons";
import { randomPick, seedRandom } from "@lib/utils/random";
import type { Cast } from "../types";

import fullbodyEmotionalImg from "./assets/fullbody-emotional.png";
import fullbodyNeutralImg from "./assets/fullbody-neutral.png";
import portraitEmotionalImg from "./assets/portrait-emotional.png";
import portraitNeutralImg from "./assets/portrait-neutral.png";
import thumbnailImg from "./assets/thumbnail.png";

const MEMBERS = 10;

const hiragana =
  "あいうえおかさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん" as const;

const castRandomizer = seedRandom(0);

function randomNickname(): string {
  const length = randomPick(
    1,
    [2, 3, 4, 5, 6, 7, 8, 9] as const,
    castRandomizer,
  );
  const nickname = randomPick(length, Array.from(hiragana), castRandomizer);
  return nickname.join("");
}

const introductionFragments = [
  [
    "はじめまして！わたしのなまえは◯◯だよ",
    "こんにちは！わたしのなまえは◯◯だよ",
    "おはよう！わたしのなまえは◯◯だよ",
    "こんばんは！わたしのなまえは◯◯だよ",
    "みなさん、はじめまして！◯◯です",
    "よろしくね！◯◯です",
    "◯◯だよ！よろしくね",
    "◯◯です！あえてうれしいです",
  ],
  [
    "わたしは、あまいものがだいすき！",
    "わたしは、いっぱいあそぶのがすき",
    "わたしは、おばあちゃんがすき",
    "わたしは、おえかきがだいすき",
    "わたしは、おんがくをきくのがだいすき",
    "わたしは、おりょうりをするのがすき",
    "わたしは、えほんをよむのがだいすき",
    "わたしは、おさんぽするのがすき",
    "わたしは、えいがをみるのがすき",
    "わたしは、げーむをするのがだいすき",
    "わたしは、おはなをそだてるのがすき",
    "わたしは、おどるのがすき",
    "わたしは、おかしづくりがすき",
    "わたしは、しゃしんをとるのがすき",
    "わたしは、おしゃべりするのがすき",
    "わたしは、すべりだいですべるのがすき",
    "わたしは、ブランコをこぐのがすき",
    "わたしは、つみきであそぶのがすき",
    "わたしは、おにごっこをするのがすき",
    "わたしは、かくれんぼをするのがすき",
    "わたしは、おままごとをするのがすき",
    "わたしは、ぬりえをするのがすき",
  ],
  [
    "みんなといっしょにあそびたいなー",
    "みんなとおはなししたいです",
    "みんなといっしょにたのしいじかんをすごしたい",
    "みんなとともだちになりたいです",
    "みんなといっしょにげーむをしたい",
    "みんなといっしょにうたをうたいたい",
    "みんなといっしょにわらいあいたい",
    "みんなといっしょにぼうけんしたい",
    "みんなといっしょにまなびたい",
    "みんなといっしょにせいちょうしたい",
    "みんなとおにごっこをしたい",
    "みんなとかくれんぼをしたい",
    "みんなとおままごとをしたい",
    "みんなとすべりだいでたのしみたい",
    "みんなとブランコをこぎたい",
  ],
  [
    "わたしのとくぎは、うたをうたうことです",
    "わたしのとくぎは、おどることです",
    "わたしのとくぎは、おりょうりをすることです",
    "わたしのとくぎは、おえかきをすることです",
    "わたしのとくぎは、がっきをひくことです",
    "わたしのとくぎは、うんどうをすることです",
    "わたしのとくぎは、おりがみをすることです",
    "わたしのとくぎは、げーむをすることです",
    "わたしのとくぎは、しゃしんをとることです",
    "わたしのとくぎは、えほんをかくことです",
  ],
  [
    "しゅみは、ほんをよむことです",
    "しゅみは、えいがをみることです",
    "しゅみは、おんがくをきくことです",
    "しゅみは、おさんぽです",
    "しゅみは、おかいものです",
    "しゅみは、かふえにいくことです",
    "しゅみは、りょこうです",
    "しゅみは、おりょうりです",
    "しゅみは、おはなをそだてることです",
    "しゅみは、あつめることです",
  ],
  [
    "すきなたべものは、けーきです",
    "すきなたべものは、おすしです",
    "すきなたべものは、らーめんです",
    "すきなたべものは、ちょこれーとです",
    "すきなたべものは、あいすくりーむです",
    "すきなたべものは、ぱすたです",
    "すきなたべものは、おこのみやきです",
    "すきなたべものは、かれーです",
    "すきなたべものは、うどんです",
    "すきなたべものは、おにぎりです",
  ],
  [
    "すきないろは、ぴんくです",
    "すきないろは、あおです",
    "すきないろは、みどりです",
    "すきないろは、むらさきです",
    "すきないろは、きいろです",
    "すきないろは、あかです",
    "すきないろは、おれんじです",
    "すきないろは、みずいろです",
    "すきないろは、しろです",
    "すきないろは、くろです",
  ],
] as const satisfies string[][];

Object.freeze(introductionFragments);

function randomIntroduction(): string {
  const fragments = Array.from(
    { length: introductionFragments.length },
    (_, i) =>
      randomPick(1, introductionFragments[i] as string[], castRandomizer),
  );

  return fragments.join("\n");
}

function randomSocialLinks(): SocialLink[] {
  const length = randomPick(1, [0, 1, 2, 3, 4, 5] as const, castRandomizer);
  return Array.from({ length }, () => ({
    type: randomSocialType(castRandomizer),
    url: "https://www.google.co.jp",
    description: "test",
  }));
}

function createMockCast(): Cast {
  const nickname = randomNickname();
  return {
    profile: {
      nickname: nickname,
      introduction: randomIntroduction(),
    },
    avatars: [
      {
        images: {
          emotional: fullbodyEmotionalImg,
          neutral: fullbodyNeutralImg,
        },
        credit: randomPick(1, [undefined, "クレジット用文章"], castRandomizer),
      },
    ],
    portrait: {
      emotional: portraitEmotionalImg,
      neutral: portraitNeutralImg,
    },
    socialLinks: randomSocialLinks(),
    themeColor: randomColorBase(castRandomizer),
    thumbnail: thumbnailImg,
    vrchat: {
      userId: nickname,
      userPageURL: "https://www.google.co.jp",
    },
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  };
}

export function createMockCasts(): Omit<Cast, "id">[] {
  return Array.from({ length: MEMBERS }, () => createMockCast());
}
