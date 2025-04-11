import { fetchCasts } from "@lib/contents/casts";

export async function GET() {
  const casts = await fetchCasts();

  const ids = casts.map((c) => c.vrchat.userId);

  return new Response(JSON.stringify(ids), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
