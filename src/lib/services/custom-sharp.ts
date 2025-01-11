import type { ImageTransform, LocalImageService } from "astro";
import baseService from "astro/assets/services/sharp";
import { isESMImportedImage, isRemoteAllowed } from "astro/assets/utils";
import { AstroError } from "astro/errors";
import type { LocalImageTransform } from "node_modules/astro/dist/assets/services/service";
import type {
  ImageOutputFormat,
  UnresolvedSrcSetValue,
} from "node_modules/astro/dist/assets/types";
import { AstroErrorData } from "node_modules/astro/dist/core/errors";

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

interface CustomImageTransform extends ImageTransform {
  crop?: CropOptions;
}

type ImageConfig = Parameters<LocalImageService["getURL"]>[1];

type Awaitable<T> = T | Promise<T>;

interface CustomSharpService {
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

let sharp: typeof import("sharp");
async function loadSharp(): Promise<typeof import("sharp")> {
  if (sharp) {
    return sharp;
  }

  try {
    sharp = (await import("sharp")).default;
    sharp.cache(false);
  } catch {
    // biome-ignore lint/suspicious/noExplicitAny: <ex公式のコードの引用だが, なんか型が間違ってるっぽいので any でごまかしてる.
    throw new AstroError(AstroErrorData.MissingSharp as any);
  }
  return sharp;
}

export default {
  validateOptions:
    baseService.validateOptions as CustomSharpService["validateOptions"],
  getSrcSet: baseService.getSrcSet as CustomSharpService["getSrcSet"],

  async getURL(options, imageConfig) {
    if (
      !isESMImportedImage(options.src) &&
      !isRemoteAllowed(options.src, imageConfig)
    ) {
      return options.src;
    }

    const defaultPath = await baseService.getURL(options, imageConfig);

    if (options.crop) {
      const additionalSearchParams = new URLSearchParams();

      const params = {
        "crop.t": "top",
        "crop.l": "left",
        "crop.w": "width",
        "crop.h": "height",
      } as const satisfies Record<string, keyof CropOptions>;

      for (const [key, value] of Object.entries(params)) {
        if (options.crop[value]) {
          additionalSearchParams.append(key, options.crop[value].toString());
        }
      }

      return defaultPath.includes("?")
        ? `${defaultPath}&${additionalSearchParams}`
        : `${defaultPath}?${additionalSearchParams}`;
    }

    return defaultPath;
  },

  async parseURL(url, imageConfig) {
    const defaultTransform = await baseService.parseURL(url, imageConfig);
    if (!defaultTransform) {
      return undefined;
    }

    const params = url.searchParams;

    const parse = (value: string | null) =>
      value ? Number.parseInt(value) : undefined;

    const ensureNotNil = <T>(value: T | null | undefined): T => {
      if (value === null || value === undefined) {
        throw new Error("Value is nil");
      }
      return value;
    };

    return {
      ...defaultTransform,
      crop: {
        top: parse(params.get("crop.t")),
        left: parse(params.get("crop.l")),
        width: ensureNotNil(parse(params.get("crop.w"))),
        height: ensureNotNil(parse(params.get("crop.h"))),
      },
    };
  },

  async getHTMLAttributes(options, imageConfig) {
    if (!baseService.getHTMLAttributes) {
      throw new Error("getHTMLAttributes is not implemented");
    }

    const { crop: _, ...defaultAttributes } =
      await baseService.getHTMLAttributes(options, imageConfig);

    if (!options.crop) {
      return defaultAttributes;
    }

    if (options.width && options.height) {
      // ユーザが指定した width と height がある場合は, defaultAttributes にはそのまま設定されている
      return defaultAttributes;
    }

    const aspectRatio = options.crop.width / options.crop.height;
    if (options.width && !options.height) {
      return {
        ...defaultAttributes,
        height: Math.round(options.width / aspectRatio),
      };
    }

    if (options.height && !options.width) {
      return {
        ...defaultAttributes,
        width: Math.round(options.height * aspectRatio),
      };
    }

    return {
      ...defaultAttributes,
      width: options.crop.width,
      height: options.crop.height,
    };
  },

  async transform(inputBuffer, options, config) {
    const sharp = await loadSharp();

    if (options.format === "svg") {
      return {
        data: inputBuffer,
        format: "svg",
      };
    }

    const result = sharp(inputBuffer, {
      failOnError: false,
      pages: -1,
      limitInputPixels: config.service.config.limitInputPixels,
    });

    result.rotate();

    // crop してから 標準の resize を行わせる
    if (options.crop) {
      const { top = 0, left = 0, width, height } = options.crop;

      result.extract({
        left: left,
        top: top,
        width: width,
        height: height,
      });
    }

    const buffer = await result.toBuffer({ resolveWithObject: true });

    return baseService.transform(
      new Uint8Array(buffer.data),
      options as LocalImageTransform,
      config,
    );
  },
} as const satisfies CustomSharpService;
