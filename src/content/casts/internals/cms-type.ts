import type { ColorThemeBase } from "@content/commons";
import type {
  MicroCMSField,
  MicroCMSImage,
  MicroCMSListContentBase,
} from "@lib/utils/microcms";

/**
 * MicroCMSから取得するキャストデータの型定義
 * ※ 実装詳細が決まるまで仮置き
 */
export interface CMSCast extends MicroCMSListContentBase {
  /**
   * 昵称
   * @example りくす
   */
  nickname: string;

  /**
   * パーソナルカラー
   * @example ["honey"]
   */
  personal_color: [ColorThemeBase];

  /**
   * VRChat ユーザー情報
   * @example { display_name: "rikusu", userpage_url: "https://vrchat.com/home/user/usr_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" }
   */

  vrchat: CMSVrchat;

  /**
   * 自己紹介 (multi-line string)
   */
  introduction: string;

  /**
   * 共有したい SNS のリンク集
   * @example [{ url: "https://x.com/xxxxxx", description: "X のリンク" }]
   */

  social_links?: CMSSocialLink[] | undefined;

  /**
   * TODO: アバター画像 (現在移行作業中のため空欄)
   */
  avatars: null;

  /**
   * アバター画像 (旧式から移行中専用)
   */
  avatars__old: CMSCastAvatarOld[];
}

/**
 * VRChat ユーザー情報
 */
interface CMSVrchat extends MicroCMSField<"vrchat"> {
  /**
   * VRChat 上の表示名
   * @example "rikusu"
   */
  display_name: string;

  /**
   * VRChat web 上のユーザーページ URL
   * @example "https://vrchat.com/home/user/usr_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   */
  userpage_url: string;
}

/**
 * SNS リンク
 */
interface CMSSocialLink extends MicroCMSField<"social_links"> {
  /**
   * SNS URL
   * @example https://x.com/xxxxxx
   */
  url: string;

  /**
   * URL の説明
   * @example "X のリンク"
   */
  description: string;
}

/**
 * アバター画像 (旧式から移行中専用)
 * @deprecated 旧式のアバター画像の型定義. 新しい移行先を現在用意中のため, 一時的にこの型を使用する
 */
interface CMSCastAvatarOld extends MicroCMSField<"avatars_image_old"> {
  /**
   * 立ち絵 (表情: ニュートラル)
   */
  standing_neutral: MicroCMSImage;

  /**
   * バストアップ (表情: ニュートラル)
   */
  bustup_neutral: MicroCMSImage;

  /**
   * 立ち絵 (表情: エモーショナル)
   */
  standing_emotional: MicroCMSImage;

  /**
   * バストアップ (表情: エモーショナル)
   */
  bustup_emotional: MicroCMSImage;

  /**
   * ベストショット
   */
  bestshot: MicroCMSImage;

  /**
   * 表記するべきアバターのクレジット情報 (ない場合は空, multi-line string)
   */
  credit?: string | undefined;
}
