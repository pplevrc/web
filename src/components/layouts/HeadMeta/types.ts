import type { ColorThemeBase } from "@content/commons";
import type { OGPMetadata } from "./internals/ogpType";
import type { Props as PolyfillProps } from "./internals/Polyfill.astro";
import type { SNSMetadata } from "./internals/snsType";

/**
 * デスクリプションメタデータのプロパティ
 */
export interface DescriptionMetaProps {
  /**
   * ページのタイトル
   */
  title: string;

  /**
   * ページの説明
   */
  description: string;

  /**
   * ページのキーワード
   */
  keywords: string[];

  /**
   * テーマカラー
   */
  themeColor?: ColorThemeBase;

  /**
   * ポリフィル設定
   */
  polyfill?: PolyfillProps;
}

/**
 * OGP メタデータのプロパティ（ページから指定する型）
 * width, height, type は自動計算されるため指定不要
 */

/**
 * OGP プロパティ（url は Layout で追加されるため除外）
 */
export interface OGPProps extends Omit<OGPMetadata, "url"> {}

/**
 * SNS プロパティ
 */
export interface SNSProps extends SNSMetadata {}
