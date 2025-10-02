import { getImage } from "astro:assets";
import type { GetImageResult } from "astro";
import { PC_VIEWPORT_WIDTH } from "../browsers/breakpoint";

const REM_TO_PX_IN_VIEWPORT_WIDE_PC = 32;

/**
 *
 * @param rem
 * @returns
 */
export function remToSizePercent(rem: number): number {
  const result = (rem * REM_TO_PX_IN_VIEWPORT_WIDE_PC) / PC_VIEWPORT_WIDTH / 2;
  return Number(result.toFixed(2));
}

export async function getOgpImage(
  src: string | ImageMetadata,
): Promise<GetImageResult> {
  return getImage({
    src,
    format: "webp",
    width: 1200,
    height: 630,
    fit: "cover",
    position: "center",
  });
}

/**
 *
 */
export interface ImageSize {
  width: number;
  height: number;
}

/**
 *
 */
export const IMAGE_4K_WIDTH = 3840;

/**
 *
 */
export const IMAGE_4K_HEIGHT = 2160;

/**
 *
 */
export const IMAGE_4K = {
  width: IMAGE_4K_WIDTH,
  height: IMAGE_4K_HEIGHT,
} as const;

/**
 *
 */
export const IMAGE_FHD_WIDTH = 1920;

/**
 *
 */
export const IMAGE_FHD_HEIGHT = 1080;

/**
 *
 */
export const IMAGE_FHD = {
  width: IMAGE_FHD_WIDTH,
  height: IMAGE_FHD_HEIGHT,
} as const;
