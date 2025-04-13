import type { HeaderPageType } from "..";
import CastsHeaderImage from "./店員さん一覧ヘッダー.jpg";

export function getMockHeaderImage(type: HeaderPageType): ImageMetadata {
  switch (type) {
    case "casts":
      return CastsHeaderImage;
  }
}
