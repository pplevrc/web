import { IS_PUBLIC } from "@lib/utils/env";

function createPublicRobots(site: string) {
  const sitemap = new URL("/sitemap-index.xml", site).toString();
  return `
User-agent: *
Allow: /
Sitemap: ${sitemap}
`.trim();
}

function createPrivateRobots() {
  return `
User-agent: *
Disallow: /
`.trim();
}

export async function GET({ site }: { site: string }) {
  const body = IS_PUBLIC ? createPublicRobots(site) : createPrivateRobots();

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
