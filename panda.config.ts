import { defineConfig } from "@pandacss/dev";
import isWsl from "is-wsl";
import ppleThemePreset from "./tokens";

export default defineConfig({
	preflight: true,
	include: ["./src/**/*.{ts,tsx,js,jsx,astro}"],
	outdir: "./src/styles",
	presets: [ppleThemePreset],

	poll: isWsl,
});
