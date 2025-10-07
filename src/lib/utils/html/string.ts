type StringHTMLParser = (text: string) => string;

/**
 * 改行を <br /> へ変換する
 * @param text
 * @returns
 */
export const breakLineToBr: StringHTMLParser = (text) =>
  text.replace(/\n/g, "<br />");

/**
 * URL を <a> へ変換する
 * @param text
 * @returns
 */
export const urlToLink: StringHTMLParser = (text) =>
  text.replace(
    /https?:\/\/[^\s]+/g,
    (url) => `<a target="_blank" href="${url}">${url}</a>`,
  );

/**
 * @param text
 */
export function toHTML(
  _text: string,
  parser: StringHTMLParser | StringHTMLParser[],
): string {
  const parsers = Array.isArray(parser) ? parser : [parser];

  return parsers.reduce((text, parser) => parser(text), _text);
}
