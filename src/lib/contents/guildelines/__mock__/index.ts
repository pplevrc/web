import type { Guideline } from "..";
import { getMockGuideline as getMockGuideline1 } from "./ぷぷりえとは？";
import { getMockGuideline as getMockGuideline5 } from "./コラボについて";
import { getMockGuideline as getMockGuideline3 } from "./ファン活動について";
import { getMockGuideline as getMockGuideline2 } from "./参加方法";
import { getMockGuideline as getMockGuideline4 } from "./店員さん募集";

export async function getMockGuidelines(): Promise<Guideline[]> {
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
