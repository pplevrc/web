import { sort, toSocialLink } from "@lib/contents/commons/SocialLink";
import { date } from "@lib/utils/temporal";
import type { Cast, FetchedCast } from "../types";

import vdcmImg from "./assets/YTJVDCM.png";
import wimaruImg from "./assets/うぃまる.png";
import usamimikaImg from "./assets/うさみみか.png";
import oukaImg from "./assets/くるりおうか.png";
import rinneImg from "./assets/星月りんね.png";
import kokoaImg from "./assets/柚月ここあ.png";

export async function createMockCasts(): Promise<FetchedCast[]> {
  const casts = [
    {
      attendanceId: 44,
      profile: {
        nickname: "うぃまる",
        introduction: `
にゃー、うぃまるですにゃ〜
たくさん遊んでにゃ〜！

うぃまるは猫なのですにゃ〜
猫はたくさん寝るから猫なのにゃぁﾑﾆｬﾆｬ
`,

        birthday: date(2, 11),
      },
      themeColor: "soda.lite",
      vrchat: {
        userId: "うぃまる（wimaru）",
        userPageURL: new URL(
          "https://vrchat.com/home/user/usr_03ca05dc-4bb8-422e-a9dd-72880e6c59d3",
        ),
      },
      avatars: [
        {
          images: {
            neutral: wimaruImg,
            expression: wimaruImg,
          },
          height: 49,
          assets: [
            await toSocialLink({
              url: "https://booth.pm/ja/items/5129661",
              description: "ぱたにゃこ | しすたーず",
            }),
          ],
        },
      ],
      socialLinks: sort([
        {
          type: "x",
          url: new URL("https://www.google.co.jp"),
          description: "うぃまるの X プロフィール",
        },
        {
          type: "bluesky",
          url: new URL("https://www.google.co.jp"),
          description: "うぃまるの Bluesky プロフィール",
        },
        {
          type: "misskey",
          url: new URL("https://www.google.co.jp"),
          description: "うぃまるの Misskey プロフィール",
        },
        {
          type: "mastodon",
          url: new URL("https://www.google.co.jp"),
          description: "うぃまるの Mastodon プロフィール",
        },
      ]),
    },
    {
      attendanceId: 60,
      profile: {
        nickname: "びでかめ",
        introduction: `
テストテストテストテスト
テストテストテスト
`,
      },
      vrchat: {
        userId: "YTJVDCM",
        userPageURL: new URL(
          "https://vrchat.com/home/user/usr_63e7fc11-c859-444d-b157-5dfe79d831a7",
        ),
      },
      themeColor: "ice.lite",
      avatars: [
        {
          images: {
            neutral: vdcmImg,
            expression: vdcmImg,
          },
          height: 85,
          assets: [],
        },
      ],
      socialLinks: sort([
        {
          type: "youtube",
          url: new URL("https://www.google.co.jp"),
          description: "ビデカメの YouTube チャンネル",
        },
        {
          type: "pixiv-fanbox",
          url: new URL("https://www.google.co.jp"),
          description: "ビデカメの Pixiv Fanbox",
        },
        {
          type: "creatia-frontier",
          url: new URL("https://www.google.co.jp"),
          description: "ビデカメの Creatia Frontier",
        },
        {
          type: "pixiv-booth",
          url: new URL("https://www.google.co.jp"),
          description: "ビデカメの Pixiv Booth ストア",
        },
      ]),
    },
    {
      attendanceId: 62,
      profile: {
        nickname: "うさみみか",
        introduction: `
卯沙美みか、ぶいあーるの姿なの
あのね、ほんとはね、7才のお姫様なの
ぶいあーるのとき、もっと、ちっちゃい子になるの
えへへへへへへ`,
        birthday: date(5, 1),
      },
      vrchat: {
        userId: "うさみ みか",
        userPageURL: new URL(
          "https://vrchat.com/home/user/usr_2f8f1ce1-49cf-4f8c-9f42-8e214b78c4a5",
        ),
      },
      themeColor: "honey.lite",
      avatars: [
        {
          images: {
            neutral: usamimikaImg,
            expression: usamimikaImg,
          },
          height: 55,
          assets: [],
        },
      ],

      socialLinks: sort([
        {
          type: "skeb",
          url: new URL("https://www.google.co.jp"),
          description: "うさみみかの Skeb",
        },
        {
          type: "pixiv-vroid-hub",
          url: new URL("https://www.google.co.jp"),
          description: "うさみみかの VRoidアバター",
        },
        {
          type: "github",
          url: new URL("https://www.google.co.jp"),
          description: "うさみみかの GitHub",
        },
      ]),
    },
    {
      attendanceId: 63,
      profile: {
        nickname: "くるりおうか",

        introduction: `
くるり おうか です！はじめまして！
ほんとうにゆめでみた、ぷぷりえのてんいんさんんになれて、うれしいです！
あまいものが、だいすきです！`,
        birthday: date(2, 5),
      },
      vrchat: {
        userId: "くるり おうか",
        userPageURL: new URL(
          "https://vrchat.com/home/user/usr_56b5964a-5d60-4207-8cf4-a595857bc8b3",
        ),
      },
      themeColor: "berry.lite",
      avatars: [
        {
          images: {
            neutral: oukaImg,
            expression: oukaImg,
          },
          height: 90,
          assets: [],
        },
      ],
      socialLinks: [],
    },
    {
      attendanceId: 64,
      profile: {
        nickname: "りんね",
        introduction: `
テストテストテストテスト
テストテストテスト
		`,
      },
      vrchat: {
        userId: "星月りんね",
        userPageURL: new URL(
          "https://vrchat.com/home/user/usr_514f4a26-61ff-419f-9f12-de0aa3bee373",
        ),
      },
      themeColor: "lavender.regular",
      avatars: [
        {
          images: {
            neutral: rinneImg,
            expression: rinneImg,
          },
          height: 110,
          assets: [],
        },
      ],
      socialLinks: [],
    },
    {
      attendanceId: 65,
      profile: {
        nickname: "ここあ",
        introduction: `
テストテストテストテスト
テストテストテスト
		`,
      },
      vrchat: {
        userId: "柚月ここあ",
        userPageURL: new URL(
          "https://vrchat.com/home/user/usr_48721cf6-012c-4c00-bde6-73fe348ba62e",
        ),
      },
      avatars: [
        {
          images: {
            neutral: kokoaImg,
            expression: kokoaImg,
          },
          height: 85,
          assets: [],
        },
      ],
      themeColor: "rose.lite",
      socialLinks: [],
    },
  ] satisfies Cast[];

  Object.freeze(casts);
  return casts;
}
