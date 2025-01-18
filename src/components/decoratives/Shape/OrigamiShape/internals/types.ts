export type CommonProps = {
  /**
   * SVG を `<symbol>` として定義するかどうか.
   * `true` にすると、`<symbol>` が返され, アイコンの SVG 定義が含まれます.
   * `false` にすると、`<use>` が返され, 事前に定義された SVG を参照します.
   */
  definition?: boolean;

  class?: string;
};
