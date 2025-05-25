/// ./ai.txt と同じ内容を返す

const body = `
User-Agent: *
Disallow: /
`.trim();

export async function GET() {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
