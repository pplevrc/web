import type { ColorThemeBase } from "@content/commons";
import type {
  MicroCMSImage,
  MicroCMSListContentBase,
} from "@lib/utils/microcms";
import type { BallonPosition } from "../types";

/**
 * ガイドライン記事
 */
export interface CMSGuideline extends MicroCMSListContentBase {
  /**
   * タイトル
   * @example "イベントの参加方法"
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
   * 記事本文
   */
  contents: string;

  /**
   * テーマカラー
   */
  "theme-color": [ColorThemeBase];

  /**
   * 一覧画面での吹き出し位置
   */
  "ballon-position": [BallonPosition];
}
