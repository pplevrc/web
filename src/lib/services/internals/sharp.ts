import type { ImageOutputFormat } from "astro";
import baseService from "astro/assets/services/sharp";
import { AstroError } from "astro/errors";
import { AstroErrorData } from "node_modules/astro/dist/core/errors";
import type { Sharp } from "sharp";
import type {
  CropOptions,
  CustomImageTransform,
  ImageConfig,
  OutlineOptions,
} from "./types";

let sharp: typeof import("sharp");

/**
 * @see `astro/dist/assets/services/service.d.ts`
 */
type LocalImageTransform = {
  src: string;
  // biome-ignore lint/suspicious/noExplicitAny: 公式流用のため
  [key: string]: any;
};

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

export async function transform(
  inputBuffer: Uint8Array,
  options: CustomImageTransform,
  config: ImageConfig,
): Promise<{
  data: Uint8Array;
  format: ImageOutputFormat;
}> {
  const sharp = await loadSharp();

  if (options.format === "svg") {
    return {
      data: inputBuffer,
      format: "svg",
    };
  }

  let image = sharp(inputBuffer, {
    failOnError: false,
    pages: -1,
    limitInputPixels: config.service.config.limitInputPixels,
  });

  ///
  /// crop など, 画像のサイズ変更を伴う処理を行う
  ///

  if (options.crop) {
    image = crop(image, options.crop);
  }

  ///
  /// デフォルトの transform を呼び出す
  ///
  const defaultFormatted = await baseService.transform(
    new Uint8Array(await image.toBuffer()),
    options as LocalImageTransform,
    config,
  );

  image = sharp(defaultFormatted.data);

  ///
  /// outline など, 画像のサイズ変更を伴わない処理を行う
  ///

  if (options.outline) {
    image = await outline(image, options.outline);
  }

  const buffer = await image.toBuffer({ resolveWithObject: true });

  return {
    data: new Uint8Array(buffer.data),
    format: defaultFormatted.format,
  };
}

function crop(image: Sharp, options: CropOptions): Sharp {
  const { top = 0, left = 0, width, height } = options;
  return image.clone().extract({
    left: left,
    top: top,
    width: width,
    height: height,
  });
}

async function outline(image: Sharp, options: OutlineOptions): Promise<Sharp> {
  const sharp = await loadSharp();

  const { thickness, color = "#FFFFFF" } = options;

  const thicknessPx = await (async (): Promise<number> => {
    if (thickness.endsWith("px")) {
      return Number.parseInt(thickness);
    }

    // FIXME: crop 指定がある場合でも、元画像のサイズを使用していそう
    const { width, height } = await image.clone().metadata();
    if (!width || !height) {
      throw new Error("Image width or height is not found");
    }
    const result = Math.max(
      1,
      Math.round((Number.parseInt(thickness) * (width + height)) / 400),
    );

    return result;
  })();

  const negatedMask = sharp(
    await image
      .clone()
      // アルファチャンネルを抽出
      .extractChannel("alpha")
      // アルファチャンネルを反転
      .negate()
      .toBuffer(),
  );

  return (
    negatedMask
      // アルファチャンネルをぼかす .. アウトラインの大きさぶんだけオブジェクトが拡大する
      .blur(thicknessPx)
      .unflatten()
      .composite([
        // 反転したアルファチャンネルを背景色で塗りつぶす
        // 1px * 1px の画像を tile: true にすることで全体に塗りつぶせる
        // blend: "in" は, 元画像を完全破棄し, 元画像の色があった箇所に対して, 入力画像で上書きする
        {
          input: {
            create: {
              width: 1,
              height: 1,
              channels: 4,
              background: color,
            },
          },
          blend: "in",
          tile: true,
        },
        // 元画像を合成
        // blend: "over" は, 元画像を破棄せず, 入力画像を上書きする
        {
          input: await image.clone().toBuffer(),
          blend: "over",
        },
      ])
  );
}
