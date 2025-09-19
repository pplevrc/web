import { fetchCast, fetchCasts, toCastMeta } from "@lib/contents/casts";
import type { APIRoute } from "astro";

interface Params {
  nickname: string;
}

export async function getStaticPaths() {
  const casts = await fetchCasts();
  return casts.map((cast) => ({
    params: { nickname: cast.profile.nickname },
  }));
}

export const GET: APIRoute<
  Record<string, never>,
  Params & Record<string, never>
> = async ({ params }) => {
  const cast = await fetchCast(params.nickname);

  return new Response(JSON.stringify(toCastMeta(cast)), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
