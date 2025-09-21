const MIN_WIDTH = 512;

function omitWidths(widths: number[]): number[] {
  const result = widths.filter((width) => width >= MIN_WIDTH);

  if (result.length <= 0) {
    // widths のなかで最大だけ返す
    return [Math.max(...widths)];
  }

  return result;
}

export function toWidths(width: number): number[] {
  return omitWidths([width, Math.round(width / 2), Math.round(width / 3)]);
}
