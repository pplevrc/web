import type { HTMLAttributes } from "astro/types";
import type { Props } from "../images/AvatarImage.astro";

export interface CommonProps extends Omit<Props, "alt"> {
  rootAttributes: HTMLAttributes<"figure">;
}
