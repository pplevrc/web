import baseService from "astro/assets/services/sharp";
import type { CustomSharpService } from "./custom-sharp";
import { configToSearchParams, searchParamsToConfig } from "./internals/path";
import { transform } from "./internals/sharp";

export type * from "./internals/types";

export default {
  validateOptions:
    baseService.validateOptions as CustomSharpService["validateOptions"],
  getSrcSet: baseService.getSrcSet as CustomSharpService["getSrcSet"],

  /**
   * 画像の変換処理
   * crop, outline の処理を独自に追加している
   */
  transform,

  /**
   * 画像の URL を取得する
   * デフォルトの getURL に対して, crop, outline のオプションに対応する Query Parameter を追加している
   */
  async getURL(options, imageConfig) {
    const defaultPath = await baseService.getURL(options, imageConfig);

    if (!defaultPath.includes(imageConfig.endpoint.route)) {
      return defaultPath;
    }

    const additionalSearchParams = configToSearchParams(options);

    console.log("defaultPath", defaultPath);
    console.log("additionalSearchParams", additionalSearchParams);
    console.log("imageConfig.endpoint.route", imageConfig.endpoint.route);

    return `${defaultPath}${defaultPath.includes("?") ? "&" : "?"}${additionalSearchParams}`;
  },

  /**
   * URL から画像の変換オプションを取得する
   * デフォルトの parseURL に対して, crop, outline に関するパラメータを抽出する処理を追加している
   */
  async parseURL(url, imageConfig) {
    const defaultTransform = await baseService.parseURL(url, imageConfig);
    if (!defaultTransform) {
      return undefined;
    }

    const params = url.searchParams;

    return {
      ...defaultTransform,
      ...searchParamsToConfig(params),
    };
  },

  /**
   * 画像の HTML 属性を取得する
   * crop 等の画像サイズ変更処理をした結果が width, height の属性に影響するように手直ししている
   */
  async getHTMLAttributes(options, imageConfig) {
    if (!baseService.getHTMLAttributes) {
      throw new Error("getHTMLAttributes is not implemented");
    }

    const {
      crop: _,
      outline: _2,
      ...defaultAttributes
    } = await baseService.getHTMLAttributes(options, imageConfig);

    return defaultAttributes;
  },
} as const satisfies CustomSharpService;
