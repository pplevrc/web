import { createHash } from "node:crypto";
import { createReadStream, createWriteStream, existsSync } from "node:fs";
import { mkdir, readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import {
  type Data,
  type FFmpegModule as FFmpeg,
  default as createFFmpegCore,
} from "@ffmpeg/core-mt";
import { SVGA_WIDTH, UXGA_WIDTH, ensureNonNil } from "./utils.js";

const isDev = process.env["NODE_ENV"] !== "production";

interface TransportArg {
  media?: "sp" | "pc";
}

interface TransportOptions extends TransportArg {
  extension: string;
  execute: TransportExecutor;
}

let ffmpeg: FFmpeg | null = null;

/**
 *
 * @returns
 */
async function loadFFmpeg(): Promise<FFmpeg> {
  if (!ffmpeg) {
    ffmpeg = await createFFmpegCore();

    ffmpeg.setTimeout(-1);
    ffmpeg.setLogger(({ message }) => {
      if (!message) return;
      console.info(message);
    });
    ffmpeg.setProgress(({ message }) => {
      if (!message) return;
      console.info(message);
    });
  }

  return ffmpeg;
}

const cacheDir = resolve(process.cwd(), ".cache/videos");

/**
 *
 * @param filePath
 * @returns
 */
export function toH264(filePath: string, opt: TransportArg): Promise<string> {
  return transport(filePath, {
    ...opt,
    extension: isDev ? ".dev.h264.mp4" : ".h264.mp4",
    execute: async (ffmpeg, { src }) => {
      const { media } = opt;

      await ffmpeg.FS.writeFile("source.mp4", src);

      await ffmpeg.exec(
        "-i",
        "source.mp4",
        "-c:v",
        "libx264",
        "-crf",
        "32",
        "-vf",
        `scale=${media === "pc" ? UXGA_WIDTH : SVGA_WIDTH}:-2`,
        "-preset",
        isDev ? "ultrafast" : "fast",
        "-movflags",
        "faststart",
        "-an",
        "dist.mp4",
      );

      return await ffmpeg.FS.readFile("dist.mp4", {
        encoding: "binary",
      });
    },
  });
}

export function toVp9(filePath: string, opt: TransportArg): Promise<string> {
  return transport(filePath, {
    ...opt,
    extension: isDev ? ".dev.vp9.webm" : ".vp9.webm",
    execute: async (ffmpeg, { src }) => {
      const { media } = opt;

      await ffmpeg.FS.writeFile("source.mp4", src);

      await ffmpeg.exec(
        "-i",
        "source.mp4",
        "-c:v",
        "libvpx-vp9",
        "-crf",
        "32",
        "-vf",
        `scale=${media === "pc" ? UXGA_WIDTH : SVGA_WIDTH}:-2`,
        "-preset",
        isDev ? "ultrafast" : "fast",
        "-movflags",
        "faststart",
        "-an",
        "dist.webm",
      );

      return await ffmpeg.FS.readFile("dist.webm", {
        encoding: "binary",
      });
    },
  });
}

export function toAv1(filePath: string, opt: TransportArg): Promise<string> {
  return transport(filePath, {
    ...opt,
    extension: isDev ? ".dev.av1.webm" : ".av1.webm",
    execute: async (ffmpeg, { src }) => {
      const { media } = opt;

      await ffmpeg.FS.writeFile("source.mp4", src);

      await ffmpeg.exec(
        "-i",
        "source.mp4",
        "-c:v",
        "libaom-av1",
        "-crf",
        "32",
        "-vf",
        `scale=${media === "pc" ? UXGA_WIDTH : SVGA_WIDTH}:-2`,
        "-preset",
        isDev ? "ultrafast" : "fast",
        "-movflags",
        "faststart",
        "-an",
        "dist.webm",
      );

      return await ffmpeg.FS.readFile("dist.webm", {
        encoding: "binary",
      });
    },
  });
}

/**
 *
 * @param filePath
 * @returns
 */
export function snapshotPoster(filePath: string): Promise<string> {
  return transport(filePath, {
    extension: ".png",
    execute: async (ffmpeg, { src }) => {
      await ffmpeg.FS.writeFile("source.mp4", src);

      await ffmpeg.exec(
        "-i",
        "source.mp4",
        "-ss",
        "0",
        "-t",
        "1",
        "-r",
        "1",
        "-f",
        "image2",
        "dist.png",
      );

      return await ffmpeg.FS.readFile("dist.png", {
        encoding: "binary",
      });
    },
  });
}

interface TransportContext {
  src: Data;
}

type Awaitable<T> = T | Promise<T>;

type TransportExecutor = (
  ffmpeg: FFmpeg,
  context: TransportContext,
) => Awaitable<Data>;

/**
 *
 * @param sourcePath e.g. "src/assets/videos/top.mp4"
 * @param extension e.g. ".mp4" ".webm" ".ogg"
 * @param execute callback to execute ffmpeg command
 * @returns
 */
async function transport(
  sourcePath: string,
  opt: TransportOptions,
): Promise<string> {
  await prepareCacheDir();

  const { media, extension, execute } = opt;

  const sourceDir = resolve(sourcePath, "..");
  const distPath = resolve(
    sourceDir,
    `${extractFileName(sourcePath)}${media ? `-${media}` : ""}.generated${extension}`,
  ).replace(`${process.cwd()}/`, "");

  const cacheFilePath = await toCacheFile(sourcePath, opt);
  let cachedFile: Data | undefined = await tryReadFile(cacheFilePath);

  if (!cachedFile) {
    const ffmpeg = await loadFFmpeg();
    try {
      const result = await execute(ffmpeg, {
        src: ensureNonNil(await tryReadFile(sourcePath)),
      });
      await write(cacheFilePath, result);
      cachedFile = result;
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
        console.error(e.stack);
      } else {
        console.error(e);
      }

      process.exit(1);
    } finally {
      ffmpeg.reset();
    }
  } else {
    console.log(`Using cached file: ${distPath}`);
  }

  if (!cachedFile) {
    throw new Error(`Failed to generate cached file: ${cacheFilePath}`);
  }

  await write(distPath, cachedFile);
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
    await mkdir(cacheDir, { recursive: true });
    prepared = true;
  } catch (error) {
    console.error(`Error preparing cache dir: ${cacheDir}`);
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
  { extension, media }: TransportOptions,
): Promise<string> {
  const contentHash = await hashByFile(sourcePath);
  return resolve(
    cacheDir,
    `${contentHash}${media ? `-${media}` : ""}${extension}`,
  ).replace(`${process.cwd()}/`, "");
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
function extractFileName(filePath: string): string {
  const parts = filePath.split("/");
  const lastPart = parts[parts.length - 1];
  if (!lastPart) {
    throw new Error(`Invalid file path: ${filePath}`);
  }

  const lastDotIndex = lastPart.lastIndexOf(".");
  return lastPart.slice(0, lastDotIndex);
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
