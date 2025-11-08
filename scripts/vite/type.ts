import type { ViteUserConfig } from "astro";

type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * astro のバージョンと, vitest, vite-node などのバージョン違いにより
 * import type { PluginOption } from "vite" としても, 型が一致しないため, 手動で astro config から型を取り出すn.
 */
export type PluginOption = NonNullable<ViteUserConfig["plugins"]>[number];
