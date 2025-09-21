import { getImage } from "astro:assets";
import type { GetImageResult, UnresolvedImageTransform } from "astro";
import {
  type Document,
  type HTMLImageElement,
  type HTMLPictureElement,
  type HTMLSourceElement,
  Window,
} from "happy-dom";

export type ImageTransformOption = Omit<
  UnresolvedImageTransform,
  "src" | "format" | "inferSize"
>;

/**
 * URLがリモートURLかどうかを判定する
 * @param url - 判定するURL
 * @returns リモートURLの場合true
 */
function isRemoteUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * source要素を作成する
 * @param document - DOM Document
 * @param image - 最適化画像情報の配列
 * @param format - 画像フォーマット
 * @returns 作成されたsource要素
 */
function createSourceElement(
  document: Document,
  image: GetImageResult,
): HTMLSourceElement {
  const { src, srcSet, attributes } = image;

  const source = document.createElement("source");
  source.setAttribute("src", src);
  source.setAttribute("srcset", srcSet.attribute);

  for (const [name, value] of Object.entries(attributes)) {
    source.setAttribute(name, value);
  }

  return source;
}

/**
 * フォールバック用のimg要素を作成する
 * @param document - DOM Document
 * @param images - 最適化画像情報の配列
 * @param originalImg - 元のimg要素
 * @returns 作成されたimg要素
 */
function createFallbackImg(
  document: Document,
  images: GetImageResult,
): HTMLImageElement {
  const { src, srcSet, attributes } = images;
  const fallbackImg = document.createElement("img");

  fallbackImg.setAttribute("src", src);
  fallbackImg.setAttribute("srcset", srcSet.attribute);

  for (const [name, value] of Object.entries(attributes)) {
    fallbackImg.setAttribute(name, value);
  }

  return fallbackImg;
}

/**
 * img要素をpicture要素に変換する
 * @param img - 元のimg要素
 * @param document - DOM Document
 * @param sizes - 画像サイズのリスト
 * @param quality - 画質
 * @returns 作成されたpicture要素
 */
async function convertImageToPicture(
  img: HTMLImageElement,
  document: Document,
  options: ImageTransformOption,
): Promise<HTMLPictureElement> {
  const src = img.getAttribute("src");
  if (!src) throw new Error("Image has no src attribute");

  const picture = document.createElement("picture");

  for (const format of ["avif", "webp", "png"] as const) {
    const images = await getImage({ src, format, ...options });

    const source = createSourceElement(document, images);
    picture.appendChild(source);

    if (format === "png") {
      const fallbackImg = createFallbackImg(document, images);
      picture.appendChild(fallbackImg);
    }
  }

  return picture;
}

/**
 * HTMLコンテンツ内のリモート画像を最適化されたローカル画像に変換する
 * img要素を複数フォーマット対応のpicture要素に変換し、レスポンシブ対応を行う
 * @param content - 変換するHTMLコンテンツ
 * @param options - 最適化オプション
 * @returns 変換されたHTMLコンテンツ
 */
export async function localizeRemoteImages(
  content: string,
  options: ImageTransformOption,
): Promise<string> {
  const window = new Window();
  const document = window.document;
  document.body.innerHTML = content;

  const images = document.querySelectorAll("img");

  for (const img of images) {
    const src = img.getAttribute("src");
    if (src && isRemoteUrl(src)) {
      try {
        const picture = await convertImageToPicture(img, document, options);
        img.parentNode?.replaceChild(picture, img);
      } catch (error) {
        console.warn(`Failed to optimize image: ${src}`, error);
      }
    }
  }

  const result = document.body.innerHTML;
  window.close();
  return result;
}
