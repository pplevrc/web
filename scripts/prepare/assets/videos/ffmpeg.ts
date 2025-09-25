import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream, createWriteStream, existsSync } from "node:fs";
import { copyFile, mkdir, readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { SVGA_WIDTH, UXGA_WIDTH, ensureNonNil, isDev } from "./utils.js";

interface TransportArg {
  media?: "sp" | "pc";
}

interface ExecOptions {
  /**
   * e.g. "src/assets/videos/top.mp4"
   */
  src: string;

  /**
   * e.g. ".mp4" ".webm" ".ogg"
   */
  distFileSuffix: string;

  /**
   * e.g. ["-i", "input", "-c:v", "libx264", "-crf", "32", "-vf", "scale=1920:-2", "-preset", "ultrafast", "-movflags", "faststart", "-an", "output"]
   */
  createOptions: (input: string, output: string) => string[];
}

const CACHE_DIR = resolve(process.cwd(), ".cache/videos");

const FFMPEG_IMAGE = "jrottenberg/ffmpeg:7-ubuntu";

/**
 *
 * @param filePath
 * @returns
 */
export function toH264(filePath: string, opt: TransportArg): Promise<string> {
  return transport({
    src: filePath,
    distFileSuffix: `-${opt.media}.generated${isDev ? ".dev" : ""}.h264.mp4`,
    createOptions: (input, output) => [
      "-y",
      "-i",
      input,
      "-c:v",
      "libx264",
      "-crf",
      "32",
      "-vf",
      `scale=${opt.media === "pc" ? UXGA_WIDTH : SVGA_WIDTH}:-2`,
      "-preset",
      isDev ? "ultrafast" : "fast",
      "-movflags",
      "faststart",
      "-an",
      output,
    ],
  });
}

export function toVp9(filePath: string, opt: TransportArg): Promise<string> {
  return transport({
    src: filePath,
    distFileSuffix: `-${opt.media}.generated${isDev ? ".dev" : ""}.vp9.webm`,
    createOptions: (input, output) => [
      "-y",
      "-i",
      input,
      "-c:v",
      "libvpx-vp9",
      "-crf",
      "32",
      "-vf",
      `scale=${opt.media === "pc" ? UXGA_WIDTH : SVGA_WIDTH}:-2`,
      "-preset",
      isDev ? "ultrafast" : "fast",
      "-movflags",
      "faststart",
      "-an",
      output,
    ],
  });
}

export function toAv1(filePath: string, opt: TransportArg): Promise<string> {
  return transport({
    src: filePath,
    distFileSuffix: `-${opt.media}.generated${isDev ? ".dev" : ""}.av1.webm`,
    createOptions: (input, output) => [
      "-y",
      "-i",
      input,
      "-c:v",
      "libaom-av1",
      "-crf",
      "32",
      "-vf",
      `scale=${opt.media === "pc" ? UXGA_WIDTH : SVGA_WIDTH}:-2`,
      "-cpu-used",
      "8",
      "-movflags",
      "faststart",
      "-an",
      output,
    ],
  });
}

export function toThumbnail(
  filePath: string,
  _opt: Omit<TransportArg, "media"> = {},
): Promise<string> {
  return transport({
    src: filePath,
    distFileSuffix: ".generated.thumbnail.webp",
    createOptions: (input, output) => [
      "-y",
      "-i",
      input,
      "-vframes",
      "1",
      "-q:v",
      "2",
      output,
    ],
  });
}

/**
 *
 * @param execute callback to execute ffmpeg command
 * @returns
 */
async function transport(opt: ExecOptions): Promise<string> {
  await prepareCacheDir();

  const { src, distFileSuffix, createOptions } = opt;

  const sourceDir = resolve(src, "..");
  const distPath = resolve(
    sourceDir,
    `${extractFileNameWithoutExt(src)}${distFileSuffix}`,
  ).replace(`${process.cwd()}/`, "");

  const cachedDist = await toCacheFile(src, opt);
  let cachedDistFile: Uint8Array | undefined = await tryReadFile(cachedDist);

  if (!cachedDistFile) {
    // docker コマンドを実行するルートが cache フォルダ配下なので、コピーもとファイルを用意しておく
    const cachedSrc = resolve(CACHE_DIR, extractFileName(src));
    if (!existsSync(cachedSrc)) {
      await copyFile(src, cachedSrc);
    }

    // docker コマンドを実行
    const ffmpegArgs = createOptions(
      extractFileName(cachedSrc),
      extractFileName(cachedDist),
    );

    const dockerArgs = [
      "run",
      "--rm",
      "-v",
      `${CACHE_DIR}:/data`,
      "-w",
      "/data",
      FFMPEG_IMAGE,
      "-stats",
      ...ffmpegArgs,
    ];
    console.log(["docker", ...dockerArgs].join(" "));

    await new Promise<void>((resolve, reject) => {
      spawn("docker", dockerArgs)
        .on("message", (message) => {
          console.log(message);
        })
        .on("exit", resolve)
        .on("error", reject);
    });

    cachedDistFile = await tryReadFile(cachedDist);
  } else {
    console.log(`Using cached file: ${distPath}`);
  }

  if (!cachedDistFile) {
    throw new Error(`Failed to generate cached file: ${cachedDist}`);
  }

  await write(distPath, cachedDistFile);
  return distPath;
}

let prepared = false;

/**
 *
 * @returns
 */
async function prepareCacheDir(): Promise<void> {
  if (prepared) {
    return;
  }

  try {
    await mkdir(CACHE_DIR, { recursive: true });
    prepared = true;
  } catch (error) {
    console.error(`Error preparing cache dir: ${CACHE_DIR}`);
    console.error(error);
  }
}

/**
 *
 * @param sourcePath
 * @param ext
 * @returns
 */
async function toCacheFile(
  sourcePath: string,
  { distFileSuffix: extension }: ExecOptions,
): Promise<string> {
  const contentHash = await hashByFile(sourcePath);
  return resolve(CACHE_DIR, `${contentHash}${extension}`).replace(
    `${process.cwd()}/`,
    "",
  );
}

/**
 *
 * @param targetPath
 * @returns
 */
async function tryReadFile(targetPath: string): Promise<Data | undefined> {
  async function checkIsFile() {
    if (!existsSync(targetPath)) {
      return false;
    }

    const cachedFileStat = await stat(targetPath);
    return cachedFileStat.isFile();
  }

  if (await checkIsFile()) {
    const raw = await readFile(targetPath);
    return raw as unknown as Uint8Array;
  }
  return undefined;
}

async function write(distFilePath: string, raw: Data): Promise<void> {
  const stream = createWriteStream(distFilePath, {
    encoding: "binary",
    flags: "w",
  });
  try {
    stream.write(raw);
    stream.end();
  } finally {
    stream.close();
  }
}

/**
 * e.g.
 * /path/to/foo/bar.mp4 -> bar
 */
function extractFileNameWithoutExt(filePath: string): string {
  const parts = filePath.split("/");
  const lastPart = ensureNonNil(
    parts[parts.length - 1],
    `Invalid file path: ${filePath}`,
  );

  const lastDotIndex = lastPart.lastIndexOf(".");
  return lastPart.slice(0, lastDotIndex);
}

/**
 * e.g.
 * /path/to/foo/bar.mp4 -> bar.mp4
 */
function extractFileName(filePath: string): string {
  const parts = filePath.split("/");
  return ensureNonNil(
    parts[parts.length - 1],
    `Invalid file path: ${filePath}`,
  );
}

/**
 *
 * @param sourcePath
 * @param rootDir
 * @returns
 */
async function hashByFile(
  sourcePath: string,
  rootDir = process.cwd(),
): Promise<string> {
  const hash = createHash("sha256");

  const stream = createReadStream(resolve(rootDir, sourcePath));
  try {
    const fullsizeHash = await new Promise<string>((resolve, reject) => {
      stream.on("error", reject);

      stream.on("data", (chunk: string) => hash.update(chunk));

      stream.on("end", () => resolve(hash.digest("hex")));
    });

    return fullsizeHash.slice(0, 16);
  } finally {
    stream?.close();
  }
}
