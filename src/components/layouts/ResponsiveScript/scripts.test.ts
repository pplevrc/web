// @vitest-environment happy-dom
import "happy-dom";
import { describe, expect, it } from "vitest";
import {
	calculateRootFontSize,
	getViewportWidth,
	setRootFontSize,
} from "./scripts";

describe("getViewportWidth", () => {
	it("window の横幅を取得できること", () => {
		// 2880 は vitest.config.ts で設定した width の値
		expect(getViewportWidth()).toBe(2880);
	});
});

describe("calculateRootFontSize", () => {
	it("モバイル (viewport: <1440) 画面では, rootFontSize は (default root font size x2) 未満で, サイズに応じて可変であること", () => {
		expect.soft(calculateRootFontSize(0, 16)).toBe(0);

		expect.soft(calculateRootFontSize(1439.99999, 16)).toBeLessThan(32);
		expect
			.soft(calculateRootFontSize(1439.99999, 16))
			.toBeGreaterThan(31.99999);

		expect.soft(calculateRootFontSize(1439.99999, 32)).toBeLessThan(64);
		expect
			.soft(calculateRootFontSize(1439.99999, 32))
			.toBeGreaterThan(63.99999);
	});

	it("PC (viewport: 1440) 画面では, rootFontSize は (default root font size) 以上で, サイズに応じて可変であること", () => {
		expect.soft(calculateRootFontSize(1440, 16)).toBe(16);
		expect.soft(calculateRootFontSize(2880, 16)).toBe(32);
		expect.soft(calculateRootFontSize(4320, 16)).toBe(48);

		expect.soft(calculateRootFontSize(1440, 32)).toBe(32);
		expect.soft(calculateRootFontSize(2880, 32)).toBe(64);
		expect.soft(calculateRootFontSize(4320, 32)).toBe(96);
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
