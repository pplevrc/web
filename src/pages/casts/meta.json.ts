import { fetchCasts, toCastMeta } from "@lib/contents/casts";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const casts = await fetchCasts();

  const meta = casts.map(toCastMeta);

  return new Response(JSON.stringify(meta), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
