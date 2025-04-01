import type AvatarImage from "../images/AvatarImage.astro";

export type CommonProps = Omit<Parameters<typeof AvatarImage>[0], "alt">;
