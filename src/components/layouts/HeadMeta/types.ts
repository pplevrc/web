import type { ColorThemeBase } from "@content/commons";
import type { OGPMetadata } from "./internals/ogpType";
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
 *
 */
export interface OGPProps extends Omit<OGPMetadata, "url"> {}

/**
 *
 */
export interface SNSProps extends SNSMetadata {}
