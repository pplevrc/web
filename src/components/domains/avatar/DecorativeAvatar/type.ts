import type { HTMLAttributes } from "astro/types";
import type { Props } from "../images/AvatarImage.astro";

export interface CommonProps
  extends Omit<Props, "alt" | "width" | "height" | "expression"> {
  rootAttributes?: HTMLAttributes<"figure">;
}
