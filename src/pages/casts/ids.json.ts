import { fetchCasts } from "@lib/contents/casts";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const casts = await fetchCasts();

  const ids = casts.map((c) => c.vrchat.userId);

  return new Response(JSON.stringify(ids), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
