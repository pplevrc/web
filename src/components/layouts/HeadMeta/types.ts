import type { ColorThemeBase } from "@content/commons";
import type { OGPImage, OGPMetadata } from "./internals/ogpType";
import type { Props as PolyfillProps } from "./internals/Polyfill.astro";
import type { SNSMetadata } from "./internals/snsType";

/**
 *
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
export type OGPImageProps = Omit<OGPImage, "width" | "height" | "type">;

/**
 * OGP プロパティ（url は Layout で追加されるため除外）
 */
export interface OGPProps extends Omit<OGPMetadata, "url" | "image"> {
  /**
   * イメージ（width, height, type は自動計算）
   */
  image?: OGPImageProps | OGPImageProps[];
}

/**
 *
 */
export interface SNSProps extends SNSMetadata {}
