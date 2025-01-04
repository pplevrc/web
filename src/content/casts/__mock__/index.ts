import { date } from "@/lib/utils/temporal";
import type { Cast, FetchedCast } from "@content/casts/types";
import { sort, toSocialLink } from "@content/commons/SocialLink";

import vdcmImg from "./assets/YTJVDCM.png";
import wimaruImg from "./assets/うぃまる.png";
import usamimikaImg from "./assets/うさみみか.png";
import oukaImg from "./assets/くるりおうか.png";
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
			themeColor: "berry.lite",
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
				await toSocialLink({
					url: "https://x.com/wi_maru",
					description: "Twitter",
				}),
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
			themeColor: "berry.lite",
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
				await toSocialLink({
					url: "https://mstdn.virtecam.net/@YTJVDCM",
					description: "ビデカメさん (Mastodon Profile)",
				}),
				await toSocialLink({
					url: "https://virtualkemomimi.net/@YTJVDCM",
					description: "ビデカメさん(けもみみ) (バーチャルケモミミ | Misskey)",
				}),
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
			themeColor: "berry.lite",
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
				await toSocialLink({
					url: "https://x.com/usamimika_vbn",
					description: "Twitter",
				}),
				await toSocialLink({
					url: "https://www.youtube.com/channel/UCzg5j8j2Kp4T0cQrRJyZT8Q",
					description: "卯沙美みか (Youtube Channel)",
				}),
			]),
		},
		{
			attendanceId: 63,
			profile: {
				nickname: "おうか",

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
			socialLinks: sort([
				await toSocialLink({
					url: "https://x.com/KurukuruOuka_VR",
					description: "Twitter",
				}),
			]),
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
			themeColor: "berry.lite",
			socialLinks: sort([
				await toSocialLink({
					url: "https://x.com/kokoa_vr",
					description: "Twitter",
				}),
				await toSocialLink({
					url: "https://www.youtube.com/@yuzuki_kokoa",
					description: "ここあちゃんねる／柚月ここあ (Youtube Channel)",
				}),
			]),
		},
	] satisfies Cast[];

	const fakeCasts = casts.flatMap((cast) => [
		cast,
		{
			...cast,
			attendanceId: cast.attendanceId * 2,
			profile: {
				...cast.profile,
				nickname: `Fake01 ${cast.profile.nickname}`,
			},
		},
		{
			...cast,
			attendanceId: cast.attendanceId * 3,
			profile: {
				...cast.profile,
				nickname: `Fake02 ${cast.profile.nickname}`,
			},
		},
	]);

	Object.freeze(fakeCasts);
	return fakeCasts;
}
