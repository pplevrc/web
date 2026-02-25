/**
 *
 */
export interface SNSMetadata {
  /**
   *
   */
  twitter: TwitterMetadata;

  // TODO:
  // facebook: FacebookMetadata;
}

/**
 * Twitter Card メタデータ型定義
 * @see https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
 */
export interface TwitterMetadata {
  /** ページのタイトル */
  title: string;

  /** ページの説明 */
  description?: string;

  /** ページを表すイメージ */
  image?: string;

  /** ページを表すイメージの alt テキスト */
  imageAlt?: string;
}
