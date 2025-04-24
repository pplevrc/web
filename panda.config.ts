import { defineConfig } from "@pandacss/dev";
import isWsl from "is-wsl";
import ppleThemePreset from "./lib/styles/index.js";

export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{ts,tsx,js,jsx,astro}"],
  outdir: "./src/styles",
  presets: [ppleThemePreset],

  strictTokens: true,
  strictPropertyValues: true,

  globalVars: {
    "--radius": {
      syntax: "<length>",
      inherits: false,
      initialValue: "0px",
    },
    "--angle-step": {
      syntax: "<number>",
      inherits: false,
      initialValue: "0",
    },
    "--offset": {
      syntax: "<number>",
      inherits: false,
      initialValue: "0",
    },
    "--angle": {
      syntax: "<number>",
      inherits: false,
      initialValue: "0",
    },
    "--total-angle": {
      syntax: "<number>",
      inherits: false,
      initialValue: "0",
    },
    "--center-x": {
      syntax: "<percentage>",
      inherits: false,
      initialValue: "50%",
    },
    "--center-y": {
      syntax: "<percentage>",
      inherits: false,
      initialValue: "50%",
    },
    // constants
    "--pi": {
      syntax: "<number>",
      inherits: false,
      initialValue: "3.14159265",
    },
  },

  hash: true,

  poll: isWsl,
});
