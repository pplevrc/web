const isPublic = process.env.SITE_IS_PUBLIC === "true";

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
  const body = isPublic ? createPublicRobots(site) : createPrivateRobots();

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
