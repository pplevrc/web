/**
 * Open Graph Protocol (OGP) の型定義
 * @see https://ogp.me
 */

/** ISO 8601 形式の日時または Date オブジェクト */
type DateValue = string | Date;

// ============================================================================
// Basic Types / 基本型
// ============================================================================

/** イメージメタデータ */
export interface OGPImage {
  /** イメージの URL */
  url: string;
  /** セキュアな URL（HTTPS）*/
  secureUrl?: string;
  /** イメージの MIME タイプ */
  type?: "image/png" | "image/jpeg" | "image/webp" | "image/gif";
  /** イメージの幅（ピクセル） */
  width?: number;
  /** イメージの高さ（ピクセル） */
  height?: number;
  /** イメージの説明文（alt テキスト） */
  alt?: string;
}

/** ビデオメタデータ */
export interface OGPVideo {
  /** ビデオの URL */
  url: string;
  /** セキュアな URL（HTTPS）*/
  secureUrl?: string;
  /** ビデオの MIME タイプ */
  type?: "video/mp4" | "video/ogg" | "video/webm";
  /** ビデオの幅（ピクセル） */
  width?: number;
  /** ビデオの高さ（ピクセル） */
  height?: number;
}

/** オーディオメタデータ */
export interface OGPAudio {
  /** オーディオの URL */
  url: string;
  /** セキュアな URL（HTTPS）*/
  secureUrl?: string;
  /** オーディオの MIME タイプ */
  type?: "audio/mpeg" | "audio/mp4" | "audio/ogg" | "audio/opus" | "audio/wav";
}

// ============================================================================
// Type-Specific Metadata / タイプ別メタデータ
// ============================================================================

/** og:type = "article" の場合のメタデータ */
export interface OGPArticle {
  /** 発行日時 */
  publishedTime?: DateValue;
  /** 最終更新日時 */
  modifiedTime?: DateValue;
  /** 有効期限 */
  expirationTime?: DateValue;
  /** 記事の著者 */
  author?: OGPProfile | OGPProfile[];
  /** 記事のカテゴリ */
  section?: string;
  /** 記事のタグ */
  tag?: string | string[];
}

/** og:type = "book" の場合のメタデータ */
export interface OGPBook {
  /** 本の著者 */
  author?: OGPProfile | OGPProfile[];
  /** ISBN */
  isbn?: string;
  /** 発売日 */
  releaseDate?: DateValue;
  /** タグ */
  tag?: string | string[];
}

/** og:type = "profile" の場合のメタデータ */
export interface OGPProfile {
  /** 最初の名前 */
  firstName?: string;
  /** 最後の名前 */
  lastName?: string;
  /** ユーザー名 */
  username?: string;
  /** 性別 */
  gender?: "male" | "female";
}

/** og:type = "music.song" の場合のメタデータ */
export interface OGPMusicSong {
  /** 曲の長さ（秒） */
  duration?: number;
  /** アルバム */
  album?:
    | (Omit<OGPMusicAlbum, "song"> & CommonDiscTrack)
    | (Omit<OGPMusicAlbum, "song"> & CommonDiscTrack)[];
  /** ミュージシャン */
  musician?: OGPProfile | OGPProfile[];
}

/** og:type = "music.album" の場合のメタデータ */
export interface OGPMusicAlbum {
  /** 曲 */
  song?:
    | (Omit<OGPMusicSong, "album"> & CommonDiscTrack)
    | (Omit<OGPMusicSong, "album"> & CommonDiscTrack)[];
  /** ミュージシャン */
  musician?: OGPProfile;
  /** リリース日 */
  releaseDate?: DateValue;
}

interface CommonDiscTrack {
  /** 曲名 */
  name: string;
  /** ディスク番号 */
  disc?: number;
  /** トラック番号 */
  track?: number;
}

/** og:type = "music.playlist" の場合のメタデータ */
export interface OGPMusicPlaylist {
  /** プレイリスト名 */
  name: string;
  /** 曲 */
  song?: OGPMusicSong;
  /** プレイリスト作成者 */
  creator?: OGPProfile;
}

/** og:type = "music.radio_station" の場合のメタデータ */
export interface OGPMusicRadioStation {
  /** ラジオ局の作成者 */
  creator?: OGPProfile;
}

/** og:type = "video.movie" の場合のメタデータ */
export interface OGPVideoMovie {
  /** 映画の俳優 */
  actor?: (OGPProfile & { role?: string }) | (OGPProfile & { role?: string }[]);
  /** 映画の監督 */
  director?: OGPProfile | OGPProfile[];
  /** 映画の脚本家 */
  writer?: OGPProfile | OGPProfile[];
  /** 映画の長さ（秒） */
  duration?: number;
  /** リリース日 */
  releaseDate?: DateValue;
  /** タグ */
  tag?: string | string[];
}

/** og:type = "video.episode" の場合のメタデータ */
export interface OGPVideoEpisode extends Omit<OGPVideoMovie, "tag"> {
  /** 関連するシリーズ */
  series?: OGPVideoSeries;
}

/** og:type = "video.tv_show" の場合のメタデータ */
export interface OGPVideoSeries extends OGPVideoMovie {}

/** og:type = "video.other" の場合のメタデータ */
export interface OGPVideoOther extends OGPVideoMovie {}

// ============================================================================
// Main Metadata Interface / メインメタデータインターフェース
// ============================================================================

/**
 * OGP（Open Graph Protocol）メタデータ
 *
 * ソーシャルメディアでのシェア時に適切に表示されるためのメタデータです。
 * og:type に応じて、関連するプロパティを指定してください。
 *
 * @see https://ogp.me
 *
 * @example
 * // Website の場合
 * const ogp: OGPMetadata = {
 *   type: "website",
 *   title: "Example Website",
 *   description: "This is an example website",
 *   url: "https://example.com",
 *   image: {
 *     url: "https://example.com/image.png",
 *     width: 1200,
 *     height: 630,
 *     alt: "Example image"
 *   },
 *   siteName: "Example"
 * };
 *
 * @example
 * // Article の場合
 * const ogp: OGPMetadata = {
 *   type: "article",
 *   title: "Article Title",
 *   description: "Article description",
 *   url: "https://example.com/article/123",
 *   image: {
 *     url: "https://example.com/article-image.png",
 *     width: 1200,
 *     height: 630,
 *     alt: "Article image"
 *   },
 *   content: {
 *     article: {
 *       publishedTime: new Date("2024-01-01"),
 *       modifiedTime: new Date("2024-01-15"),
 *       author: {
 *         firstName: "John",
 *         lastName: "Doe"
 *       },
 *       section: "Technology",
 *       tag: ["tech", "web"]
 *     }
 *   }
 * };
 *
 * @example
 * // Video の場合
 * const ogp: OGPMetadata = {
 *   type: "video.movie",
 *   title: "Movie Title",
 *   description: "Movie description",
 *   url: "https://example.com/movie",
 *   image: {
 *     url: "https://example.com/movie-poster.png",
 *     width: 1200,
 *     height: 630
 *   },
 *   content: {
 *     video: {
 *       movie: {
 *         duration: 7200,
 *         releaseDate: new Date("2024-01-01"),
 *         director: {
 *           firstName: "Jane",
 *           lastName: "Smith"
 *         },
 *         actor: {
 *           firstName: "Tom",
 *           lastName: "Hanks",
 *           role: "Lead Actor"
 *         },
 *         tag: ["action", "drama"]
 *       }
 *     }
 *   }
 * };
 *
 * @example
 * // Music の場合
 * const ogp: OGPMetadata = {
 *   type: "music.song",
 *   title: "Song Title",
 *   description: "Song by Artist Name",
 *   url: "https://example.com/song",
 *   image: {
 *     url: "https://example.com/album-art.png",
 *     width: 1200,
 *     height: 1200
 *   },
 *   content: {
 *     music: {
 *       song: {
 *         duration: 240,
 *         album: {
 *           releaseDate: new Date("2024-01-01")
 *         },
 *         musician: {
 *           firstName: "Artist",
 *           lastName: "Name"
 *         }
 *       }
 *     }
 *   }
 * };
 */
export interface OGPMetadata {
  // ========================================================================
  // Required Properties / 必須プロパティ
  // ========================================================================

  /** ページのタイトル */
  title: string;

  /** ページの種類 */
  type:
    | "website"
    | "article"
    | "book"
    | "profile"
    | "payment.link"
    | "music.song"
    | "music.album"
    | "music.playlist"
    | "music.radio_station"
    | "video.movie"
    | "video.episode"
    | "video.tv_show"
    | "video.other";

  /** ページを表すイメージ */
  image: OGPImage | OGPImage[];

  /** ページの正規 URL */
  url: string;

  // ========================================================================
  // Optional Properties / オプショナルプロパティ
  // ========================================================================

  /** ページの簡潔な説明 */
  description?: string;

  /** ページが属するウェブサイトの名前 */
  siteName?: string;

  /** コンテンツの言語（ISO 639-1 形式） */
  locale?: string;

  /** 別言語でのコンテンツの言語ロケール */
  localeAlternate?: string[];

  /** ページの成分の前に現れる単語 */
  determiner?: "a" | "an" | "the" | "auto" | "";

  /** ページに関連するビデオ */
  video?: OGPVideo | OGPVideo[];

  /** ページに関連するオーディオ */
  audio?: OGPAudio | OGPAudio[];

  // ========================================================================
  // Content Metadata / コンテンツ修飾情報（SEO・詳細メタデータ用）
  // ========================================================================

  /** コンテンツの詳細メタデータ（og:type に応じた構造化情報） */
  content?: {
    /** og:type = "article" の場合のメタデータ */
    article?: OGPArticle;

    /** og:type = "book" の場合のメタデータ */
    book?: OGPBook;

    /** og:type = "profile" の場合のメタデータ */
    profile?: OGPProfile;

    /**
     * og:type = "music.*" の場合のメタデータ
     * @see https://ogp.me/#type_music
     */
    music?: {
      /** og:type = "music.song" の場合のメタデータ */
      song?: OGPMusicSong;
      /** og:type = "music.album" の場合のメタデータ */
      album?: OGPMusicAlbum;
      /** og:type = "music.playlist" の場合のメタデータ */
      playlist?: OGPMusicPlaylist;
      /** og:type = "music.radio_station" の場合のメタデータ */
      radioStation?: OGPMusicRadioStation;
    };

    /**
     * og:type = "video.*" の場合のメタデータ
     * @see https://ogp.me/#type_video
     */
    video?: {
      /** og:type = "video.movie" の場合のメタデータ */
      movie?: OGPVideoMovie;
      /** og:type = "video.episode" の場合のメタデータ */
      episode?: OGPVideoEpisode;
      /** og:type = "video.tv_show" の場合のメタデータ */
      series?: OGPVideoSeries;
      /** og:type = "video.other" の場合のメタデータ */
      other?: OGPVideoOther;
    };
  };
}
