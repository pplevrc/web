import { globby } from "globby";
import { snapshotPoster, toAv1, toH264, toVp9 } from "./ffmpeg.js";
import { isDev } from "./utils.js";

async function main() {
  if (isDev) {
    await generateDev();
  } else {
    await generateProd();
  }
}

async function generateDev() {
  const files = await findAllMP4Files();
  const promises: Promise<void>[] = [];

  for (const file of files) {
    // 開発向けにはエンコードが最も早い H264 のみを表示する
    promises.push(transportH264(file));
    promises.push(snapshot(file));
  }

  await Promise.all(promises);
}

async function generateProd() {
  const files = await findAllMP4Files();

  // TODO: CI が問題なさそうなら並列化する
  for (const file of files) {
    await transportAv1(file);
    await transportWebM(file);
    await snapshot(file);
  }
}

async function findAllMP4Files(rootDir = process.cwd()): Promise<string[]> {
  return (await globby([`${rootDir}/src/**/*.mp4`, "!**/*.generated.*"])).map(
    (filePath) => filePath.replace(`${rootDir}/`, ""),
  );
}

async function transportH264(filePath: string): Promise<void> {
  try {
    console.log(`Transporting: ${filePath} to avc`);
    await toH264(filePath, { media: "pc" });
    await toH264(filePath, { media: "sp" });
  } catch (error) {
    console.error(`Error transporting: ${filePath}`);
    console.error(error);
  }
}

async function transportWebM(filePath: string): Promise<void> {
  try {
    console.log(`Transporting: ${filePath} to vp9`);
    await toVp9(filePath, { media: "pc" });
    await toVp9(filePath, { media: "sp" });
  } catch (error) {
    console.error(`Error transporting: ${filePath}`);
    console.error(error);
  }
}

async function transportAv1(filePath: string): Promise<void> {
  try {
    console.log(`Transporting: ${filePath} to av1`);
    await toAv1(filePath, { media: "pc" });
    await toAv1(filePath, { media: "sp" });
  } catch (error) {
    console.error(`Error transporting: ${filePath}`);
    console.error(error);
  }
}

async function snapshot(filePath: string): Promise<void> {
  try {
    console.log(`Snapshotting: ${filePath}`);
    const distFile = await snapshotPoster(filePath);
    console.log(`Snapshot: ${distFile}`);
  } catch (error) {
    console.error(`Error snapshotting: ${filePath}`);
    console.error(error);
  }
}

main();
