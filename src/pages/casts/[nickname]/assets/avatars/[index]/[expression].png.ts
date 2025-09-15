import { fetchAvatarImage, fetchCasts } from "@lib/contents/casts";
import type { AvatarImages } from "@lib/contents/casts";
import { memoize } from "@lib/utils/cache";
import type { APIRoute, GetStaticPaths, GetStaticPathsItem } from "astro";

interface Params {
  nickname: string;
  index: string;
  expression: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const casts = await fetchCasts();
  const paths: GetStaticPathsItem[] = [];

  for (const cast of casts) {
    for (let i = 0; i < cast.avatars.length; i++) {
      paths.push({
        params: {
          nickname: cast.profile.nickname,
          index: i.toString(),
          expression: "neutral",
        } satisfies Params,
      });
      paths.push({
        params: {
          nickname: cast.profile.nickname,
          index: i.toString(),
          expression: "emotional",
        } satisfies Params,
      });
    }
  }

  return paths;
};

const fetchImage = memoize(
  async (
    src: string,
  ): Promise<{ buffer: ArrayBuffer; contentType: string }> => {
    const response = await fetch(src);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "image/png";
    const imageBuffer = await response.arrayBuffer();

    return { buffer: imageBuffer, contentType };
  },
);

export const GET: APIRoute<
  Record<string, unknown>,
  Params & Record<string, undefined>
> = async ({ params }) => {
  const { nickname, index, expression } = params;

  try {
    const src = await fetchAvatarImage({
      nickname,
      index: Number.parseInt(index),
      expression: expression as keyof AvatarImages,
    });

    // TODO: うまくいかない可能性アリ
    if (typeof src !== "string") {
      return new Response("Use local image", {
        status: 302,
        headers: { Location: "/" },
      });
    }

    const { buffer, contentType } = await fetchImage(src);

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Error fetching avatar image:", error);
    return new Response("Internal server error", { status: 500 });
  }
};
