import { globby } from "globby";
import { snapshotPoster, toAv1, toH264, toVp9 } from "./ffmpeg.js";

async function main() {
  await generate();
}

async function generate() {
  const files = await findAllMP4Files();

  for (const file of files) {
    await transportH264(file);
    // await transportWebM(file);
    // await transportAv1(file);
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
    console.log(`Transporting: ${filePath} to h264`);
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
