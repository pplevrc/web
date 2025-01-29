import type { ImageTransform, LocalImageService } from "astro";
import type {
  ImageOutputFormat,
  UnresolvedSrcSetValue,
} from "node_modules/astro/dist/assets/types";

export type ImageConfig = Parameters<LocalImageService["getURL"]>[1];

type Awaitable<T> = T | Promise<T>;

/**
 * 画像の切り取りオプション
 */
export interface CropOptions {
  /**
   * @default 0
   */
  top?: number;

  /**
   * @default 0
   */
  left?: number;

  /**
   *
   */
  width: number;

  /**
   *
   */
  height: number;
}

/**
 * 画像の枠線オプション
 */
export interface OutlineOptions {
  /**
   * 枠線の太さ
   * px .. ピクセル単位
   * % .. 画像の縦横サイズに対する割合
   */
  thickness: `${number}px` | `${number}%`;

  /**
   * 枠線のぼかしのシグマ
   * @default 0
   */
  blurSigma?: number;

  /**
   * 枠線の色
   * @default "#FFFFFF"
   */
  color?: string;
}

/**
 * astro の ImageTransform を拡張した独自 ImageTransform
 */
export interface CustomImageTransform extends ImageTransform {
  /**
   * 画像の切り取りを行う
   * @example
   * ```ts
   * {
   *   crop: {
   *     width: 100,
   *     height: 100,
   *     left: 0,
   *     top: 0,
   *   },
   * }
   * ```
   */
  crop?: CropOptions;

  /**
   * 画像の枠線を行う
   * @example
   * ```ts
   * {
   *   outline: {
   *     thickness: "1px",
   *     blurSigma: 1,
   *     color: "#000000",
   *   },
   * }
   * ```
   */
  outline?: OutlineOptions;
}

export type PickedCustomImageTransform = Pick<
  CustomImageTransform,
  "crop" | "outline"
>;

export interface CustomSharpService {
  /**
   *
   * @override LocalImageService["getURL"]
   * @param options
   * @param imageConfig
   */
  getURL(
    options: CustomImageTransform,
    imageConfig: ImageConfig,
  ): Awaitable<string>;

  /**
   *
   * @override LocalImageService["getSrcSet"]
   * @param options
   * @param imageConfig
   */
  getSrcSet(
    options: CustomImageTransform,
    imageConfig: ImageConfig,
  ): Awaitable<UnresolvedSrcSetValue[]>;

  /**
   *
   * @override LocalImageService["getHTMLAttributes"]
   * @param options
   * @param imageConfig
   */
  getHTMLAttributes(
    options: CustomImageTransform,
    imageConfig: ImageConfig,
    // biome-ignore lint/suspicious/noExplicitAny: 汎用的な型のため any を許容する
  ): Awaitable<Record<string, any>>;

  /**
   *
   * @override LocalImageService["validateOptions"]
   * @param options
   * @param imageConfig
   */
  validateOptions(
    options: CustomImageTransform,
    imageConfig: ImageConfig,
  ): Awaitable<CustomImageTransform>;

  /**
   *
   * @override LocalImageService["transform"]
   * @param inputBuffer
   * @param transform
   * @param imageConfig
   */
  transform(
    inputBuffer: Uint8Array,
    transform: CustomImageTransform,
    imageConfig: ImageConfig,
  ): Promise<{
    data: Uint8Array;
    format: ImageOutputFormat;
  }>;

  /**
   *
   * @override LocalImageService["parseURL"]
   * @param options
   * @param imageConfig
   */
  parseURL(
    options: URL,
    imageConfig: ImageConfig,
  ): Awaitable<CustomImageTransform | undefined>;
}
