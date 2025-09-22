import { getCollection, getEntry } from "astro:content";
import { toCastMeta } from "@content/casts";
import type { APIRoute } from "astro";

interface Params {
  nickname: string;
}

export async function getStaticPaths() {
  const casts = await getCollection("casts");
  return casts.map((cast) => ({
    params: { nickname: cast.id },
  }));
}

export const GET: APIRoute<
  Record<string, never>,
  Params & Record<string, never>
> = async ({ params }) => {
  const { data: cast } = (await getEntry("casts", params.nickname)) ?? {
    data: undefined,
  };

  if (!cast) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(JSON.stringify(toCastMeta(cast)), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
