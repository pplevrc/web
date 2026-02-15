import type { ColorThemeBase } from "@content/commons";
import type {
  MicroCMSImage,
  MicroCMSListContentBase,
} from "@lib/utils/microcms";

/**
 * お知らせ記事
 */
export interface CMSArticle extends MicroCMSListContentBase {
  /**
   * 記事タイトル
   */
  title: string;

  /**
   * キーワード (comma-separated string)
   * @example "keyword1,keyword2,keyword3"
   */
  keywords?: string;

  /**
   * 記事説明文
   */
  description: string;

  /**
   * トップ画像
   */
  "hero-image": MicroCMSImage;

  /**
   * トップ画像のaltテキスト
   */
  "hero-image-alt": string;

  /**
   * トップ画像のアクセシビリティラベル
   */
  "hero-image-label"?: string | null;

  /**
   * テーマカラー
   */
  "theme-color": [ColorThemeBase];

  /**
   * 記事本文
   */
  content: string;
}
