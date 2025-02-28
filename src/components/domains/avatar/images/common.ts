import { PC_VIEWPORT_WIDTH } from "@/lib/browsers/breakpoint";

export function toWidths(width: number): number[] {
  if (width >= PC_VIEWPORT_WIDTH) {
    const optimizedWidth = [
      width,
      Math.round(width * 1.5),
      Math.round(width / 1.5),
      Math.round(width / 2),
      Math.round(width / 2.5),
    ];

    return optimizedWidth;
  }

  if (width >= PC_VIEWPORT_WIDTH / 2) {
    return [Math.round(width / 1.5), width, Math.round(width * 1.5)];
  }

  return [width, Math.round(width * 2), Math.round(width * 3)];
}
