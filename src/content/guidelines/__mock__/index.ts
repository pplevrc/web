import type { Guideline } from "@content/guidelines";
import { getMockGuideline as getMockGuideline1 } from "./1.ぷぷりえとは？";
import { getMockGuideline as getMockGuideline2 } from "./2.参加方法";
import { getMockGuideline as getMockGuideline3 } from "./3.ファン活動について";
import { getMockGuideline as getMockGuideline4 } from "./4.店員さん募集";
import { getMockGuideline as getMockGuideline5 } from "./5.コラボについて";

export async function getMockGuidelines(): Promise<Omit<Guideline, "id">[]> {
  return [
    await getMockGuideline1(),
    await getMockGuideline2(),
    await getMockGuideline3(),
    await getMockGuideline4(),
    await getMockGuideline5(),
    await getMockGuideline1(),
    await getMockGuideline2(),
    await getMockGuideline3(),
    await getMockGuideline4(),
    await getMockGuideline5(),
  ];
}

export async function getMockShortcutGuidelines(): Promise<
  Omit<Guideline, "id">[]
> {
  return [await getMockGuideline1(), await getMockGuideline2()];
}
