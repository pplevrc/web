import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const casts = await getCollection("casts");

  const ids = casts.map((c) => c.data.vrchat.userId);

  return new Response(JSON.stringify(ids), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
