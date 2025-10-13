/**
 * サイトを公開する税体のビルドモードになっているかどうか?
 *
 * サイトは production mode でビルドしても, robots.txt でクローリングを拒否すれば検索にヒットしなくなることを, この環境変数によって制御する.
 */
export const IS_PUBLIC = process.env.SITE_IS_PUBLIC === "true";

/**
 * 本番モードかどうか?
 */
export const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Google Tag Manager の ID
 */
export const GTM_ID = process.env.GTM_ID;

/**
 * モックデータを利用するかどうか?
 */
export const USE_MOCK = process.env.MOCK !== "false";

/**
 * Content データ取得時に Astro data store のキャッシュを利用するかどうか?
 */
export const USE_CACHE = process.env.FETCH_CONTENT_FORCE !== "true";

/**
 * CONTENTS の API キー
 */
export const CONTENTS_API_KEY = process.env.CONTENTS_API_KEY;

/**
 * CONTENTS のサービス ID
 */
export const CONTENTS_SERVICE_ID = process.env.CONTENTS_SERVICE_ID;

/**
 * 店員さんデータの取得URL
 */
export const CONTENTS_CASTS_URL = process.env.CONTENTS_CASTS_URL;

/**
 * 店員さんデータの取得用API-KEY
 */
export const CONTENTS_CASTS_API_KEY = process.env.CONTENTS_CASTS_API_KEY;
