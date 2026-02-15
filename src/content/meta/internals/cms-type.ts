import type { CMSGuideline } from "@content/guidelines";
import type {
  MicroCMSImage,
  MicroCMSObjectContentBase,
} from "@lib/utils/microcms";

/**
 * ページのメタ情報
 */
export interface CMSPageMeta {
  /**
   * ページのタイトル (title element 用)
   */
  title: string;

  /**
   * 戻るリンクのラベル
   */
  backLinkLabel: string;

  /**
   * ページの説明文 (description element 用)
   */
  description: string;

  /**
   * キーワード (keywords element 用, comma-separated string)
   */
  keywords: string;

  /**
   * ページのヘッダー及び OGP 画像
   */
  "hero-image": MicroCMSImage;
}

/**
 * コンテンツページのメタ情報
 */
export interface CMSContentPageMeta {
  /**
   * ページのタイトル (title element 用)
   */
  title: string;

  /**
   * ページの説明文 (description element 用)
   */
  description: string;

  /**
   * キーワード (keywords element 用, comma-separated string)
   */
  keywords: string;
}

/**
 * SNS リンク
 */
export interface CMSSocialLink {
  /**
   * URL
   */
  url: string;

  /**
   * 説明文
   */
  description: string;
}

/**
 * サイト全体のメタ情報
 */
export interface CMSMeta extends MicroCMSObjectContentBase {
  /**
   * トップページのガイドラインのショートカット
   */
  "guidelines-shortcut": CMSGuideline[];

  /**
   * プライバシーポリシーのページリンク
   */
  "privacy-policy": CMSGuideline;

  /**
   * プライバシーノート
   */
  "privacy-notice": string;

  /**
   * クッキーに関するページの説明文
   */
  "cookie-concent": string;

  /**
   * 全ページの keyword (keyword element 用, comma-separated string)
   */
  "common-keywords": string;

  /**
   * すべてのページの Footer に表示するコピーライト表記
   */
  copyright: string;

  /**
   * トップページのメタ情報
   */
  home: CMSPageMeta;

  /**
   * キャストページのメタ情報
   */
  cast: CMSContentPageMeta;

  /**
   * キャスト一覧ページのメタ情報
   */
  casts: CMSPageMeta;

  /**
   * コンテンツページのメタ情報
   */
  article: CMSContentPageMeta;

  /**
   * コンテンツ一覧ページのメタ情報
   */
  articles: CMSPageMeta;

  /**
   * ガイドラインページのメタ情報
   */
  guideline: CMSContentPageMeta;

  /**
   * ガイドライン一覧ページのメタ情報
   */
  guidelines: CMSPageMeta;

  /**
   * Footer 表記の SNS リンク
   */
  "social-links": CMSSocialLink[];
}
