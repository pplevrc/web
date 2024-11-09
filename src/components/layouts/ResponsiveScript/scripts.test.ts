import { describe, expect, it } from "vitest";
import { calculateRootFontSize, setRootFontSize } from "./scripts";

describe("calculateRootFontSize", () => {
	it("モバイル (viewport: <1440) 画面では, rootFontSize は (default root font size x2) 未満で, サイズに応じて可変であること", () => {
		expect
			.soft(
				calculateRootFontSize({
					defaultRootFontSize: 16,
					viewportWidth: 0,
				}),
			)
			.toBe(0);

		expect
			.soft(
				calculateRootFontSize({
					defaultRootFontSize: 16,
					viewportWidth: 1439.99999,
				}),
			)
			.toBeLessThan(32);

		expect
			.soft(
				calculateRootFontSize({
					defaultRootFontSize: 16,
					viewportWidth: 1439.99999,
				}),
			)
			.toBeGreaterThan(31.99999);

		expect
			.soft(
				calculateRootFontSize({
					defaultRootFontSize: 32,
					viewportWidth: 1439.99999,
				}),
			)
			.toBe(64);

		expect
			.soft(
				calculateRootFontSize({
					defaultRootFontSize: 32,
					viewportWidth: 1439.99999,
				}),
			)
			.toBeLessThan(63.99999);
	});

	it("PC (viewport: 1440) 画面では, rootFontSize は (default root font size) 以上で, サイズに応じて可変であること", () => {
		expect
			.soft(
				calculateRootFontSize({
					defaultRootFontSize: 16,
					viewportWidth: 1440,
				}),
			)
			.toBe(16);

		expect
			.soft(
				calculateRootFontSize({
					defaultRootFontSize: 16,
					viewportWidth: 2880,
				}),
			)
			.toBe(32);

		expect
			.soft(
				calculateRootFontSize({
					defaultRootFontSize: 16,
					viewportWidth: 4320,
				}),
			)
			.toBe(48);

		expect
			.soft(
				calculateRootFontSize({
					defaultRootFontSize: 32,
					viewportWidth: 1440,
				}),
			)
			.toBe(32);

		expect
			.soft(
				calculateRootFontSize({
					defaultRootFontSize: 32,
					viewportWidth: 2880,
				}),
			)
			.toBe(64);

		expect
			.soft(
				calculateRootFontSize({
					defaultRootFontSize: 32,
					viewportWidth: 4320,
				}),
			)
			.toBe(96);
	});
});

describe("setRootFontSize", () => {
	it("root font size が設定されること", () => {
		setRootFontSize(16);
		expect(document.documentElement.style.fontSize).toBe("16px");

		setRootFontSize(32);
		expect(document.documentElement.style.fontSize).toBe("32px");
	});
});
