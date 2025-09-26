/**
 * クエリパラメータ付きビデオファイルインポート時の型定義
 */

// ?mediaType クエリでメディアタイプを取得
declare module "*?mediaType" {
  const mediaType: string;
  export default mediaType;
}
