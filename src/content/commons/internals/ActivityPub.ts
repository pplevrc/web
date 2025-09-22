interface ActivityPubNodeInfo {
  version: string;
  software: {
    /**
     * @example "mastodon"
     */
    name: string;

    versions: string;
  };
  protocols: string[];
}

interface WellknownActivityPubNodeInfo {
  links: {
    rel: string;
    href: string;
  }[];
}

async function fetchWellknownActivityPubNodeInfo(
  url: URL,
): Promise<WellknownActivityPubNodeInfo> {
  const wellknownURL = new URL("/.well-known/nodeinfo", url);
  const response = await fetch(wellknownURL.href);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch well-known nodeinfo (url: ${url} status: ${response.status})`,
    );
  }

  return await response.json();
}

async function fetchActivityPubNodeInfo(
  wellknownInfo: WellknownActivityPubNodeInfo,
): Promise<ActivityPubNodeInfo> {
  // 基本的には links の 0 番目の href のリンクで ActivityPubNodeInfo を取得できる模様 (by: JYTJVDCM)
  const href = wellknownInfo.links[0]?.href;
  if (!href) {
    throw new Error("Failed to fetch ActivityPub nodeinfo");
  }

  const response = await fetch(href);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ActivityPub nodeinfo (${response.status})`,
    );
  }

  return await response.json();
}

const cacheActivityPubSoftwareName = new Map<string, string | undefined>();

export async function retrieveActivityPubSoftwareName(
  url: URL,
): Promise<string | undefined> {
  if (!cacheActivityPubSoftwareName.has(url.origin)) {
    try {
      const wellknownInfo = await fetchWellknownActivityPubNodeInfo(url);
      const nodeInfo = await fetchActivityPubNodeInfo(wellknownInfo);
      cacheActivityPubSoftwareName.set(url.origin, nodeInfo.software.name);
    } catch (error) {
      cacheActivityPubSoftwareName.set(url.origin, undefined);
    }
  }

  return cacheActivityPubSoftwareName.get(url.origin);
}
