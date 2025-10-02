import type { ImageSize } from "@lib/utils/image";

const MIN_WIDTH = 512;

/**
 *
 * @param widths
 * @param imageSize
 * @returns
 */
function omitWidths(widths: number[], imageSize: ImageSize): number[] {
  const { width: maxWidth } = imageSize;

  const result = widths.filter(
    (width) => width >= MIN_WIDTH || width <= maxWidth,
  );

  if (result.length <= 0) {
    // widths のなかで最大だけ返す
    return [Math.max(...widths)];
  }

  return result;
}

/**
 *
 * @param width
 * @param imageSize
 * @returns
 */
export function toWidths(width: number, imageSize: ImageSize): number[] {
  return omitWidths([width * 2, width, Math.round(width / 2)], imageSize);
}
