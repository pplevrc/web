import { defineConfig } from "@pandacss/dev";
import isWsl from "is-wsl";
import { removeUnusedKeyframes } from "lib/cleanup/remove-unused-keyframe";
import { removeUnusedCssVars } from "lib/cleanup/remove-unused-variables";
import ppleThemePreset from "./lib/styles";

export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{ts,tsx,js,jsx,astro}"],
  outdir: "./src/styles",
  presets: [ppleThemePreset],

  strictTokens: true,
  strictPropertyValues: true,

  hooks: {
    "cssgen:done": ({ artifact, content }) => {
      if (artifact === "styles.css") {
        return removeUnusedCssVars(removeUnusedKeyframes(content));
      }

      return content;
    },
  },

  hash: true,

  poll: isWsl,
});
