import { getCollection } from "astro:content";
import { toCastMeta } from "@content/casts";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const casts = await getCollection("casts");

  const meta = casts.map((cast) => toCastMeta(cast.data));

  return new Response(JSON.stringify(meta), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
