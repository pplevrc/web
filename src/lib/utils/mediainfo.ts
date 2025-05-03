import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { AV, AVC, VP } from "media-codecs";
import mediaInfoFactory, {
  type GeneralTrack,
  type MediaInfo,
  type MediaInfoResult,
  type VideoTrack,
} from "mediainfo.js";
import { ensureNonNil } from "./type";
interface FileLoader {
  filesize: number;
  readChunk: (size: number, offset: number) => Uint8Array;
}

async function readVideo(filePath: string): Promise<FileLoader> {
  const buffer = await readFile(join(process.cwd(), filePath));
  return {
    filesize: buffer.length,
    readChunk: (size, offset) => {
      const data = buffer.slice(offset, offset + size);
      return new Uint8Array(data);
    },
  };
}

async function getMediaInfo(filePath: string): Promise<MediaInfoResult> {
  let mediaInfo: MediaInfo | null = null;
  try {
    mediaInfo = await mediaInfoFactory({ format: "object", full: true });

    const { filesize, readChunk } = await readVideo(filePath);
    const result = await mediaInfo.analyzeData(filesize, readChunk);
    return result;
  } finally {
    mediaInfo?.close();
  }
}

function toTypeString(mediaInfo: MediaInfoResult): string {
  const [generalTrack, videoTrack] = findTracks(mediaInfo);

  const mediaType = ensureNonNil(
    generalTrack.InternetMediaType,
    "InternetMediaType not found",
  );
  const format = ensureNonNil(videoTrack.Format, "Format not found");

  const codecs = (() => {
    switch (format) {
      case "AVC":
        return toAVCCodecs(videoTrack);
      case "VP9":
        return toVp9Codecs(videoTrack);
      case "AV1":
        return toAv1Codecs(videoTrack);
      default:
        throw new Error(`Unsupported codec: ${format}`);
    }
  })();

  return `${mediaType};codecs="${codecs}"`;
}

function toAVCCodecs(videoTrack: VideoTrack): string {
  return AVC.getCodec({
    profile: ensureNonNil(
      videoTrack.Format_Profile,
      "Format_Profile not found",
    ),
    level: ensureNonNil(videoTrack.Format_Level, "Format_Level not found"),
  });
}

function toVp9Codecs(videoTrack: VideoTrack): string {
  return VP.getCodec({
    name: ensureNonNil(videoTrack.Format_String, "Format_String not found"),
    profile: Number.parseInt(
      ensureNonNil(videoTrack.Format_Profile, "Format_Profile not found"),
    ),
    bitDepth: ensureNonNil(videoTrack.BitDepth, "BitDepth not found"),
    level: toVp9Level({
      width: ensureNonNil(videoTrack.Width, "Width not found"),
      height: ensureNonNil(videoTrack.Height, "Height not found"),
      frameRate: ensureNonNil(videoTrack.FrameRate, "FrameRate not found"),
    }).toString(),
  });
}

interface Vp9LevelSource {
  width: number;
  height: number;
  frameRate: number;
}

function toVp9Level({ width, height, frameRate }: Vp9LevelSource): string {
  const pixelsPerSecond = width * height * frameRate;

  if (pixelsPerSecond <= 829440) return "1"; // 640x360@30
  if (pixelsPerSecond <= 2764800) return "2"; // 1280x720@30
  if (pixelsPerSecond <= 4608000) return "3"; // 1600x900@30 など
  if (pixelsPerSecond <= 6220800) return "3.1"; // ～1920x1080@30
  if (pixelsPerSecond <= 10368000) return "4"; // ～1920x1080@60
  if (pixelsPerSecond <= 20736000) return "5"; // ～4K@30
  if (pixelsPerSecond <= 41779200) return "5.1"; // ～4K@60
  if (pixelsPerSecond <= 83558400) return "5.2"; // ～8K@30
  return "6.1"; // fallback（8K@60 やそれ以上）
}

function toAv1Codecs(videoTrack: VideoTrack): string {
  return AV.getCodec({
    name: ensureNonNil(videoTrack.Format_String, "Format_String not found"),
    profile: ensureNonNil(
      videoTrack.Format_Profile,
      "Format_Profile not found",
    ),
    bitDepth: ensureNonNil(videoTrack.BitDepth, "BitDepth not found"),
    level: ensureNonNil(videoTrack.Format_Level, "Format_Level not found"),
    tier: "Main",
  });
}

function findTracks(mediaInfo: MediaInfoResult): [GeneralTrack, VideoTrack] {
  const generalTrack = mediaInfo.media?.track.find(
    (track) => track["@type"] === "General",
  ) as GeneralTrack | undefined;
  const videoTrack = mediaInfo.media?.track.find(
    (track) => track["@type"] === "Video",
  ) as VideoTrack | undefined;
  return [
    ensureNonNil(generalTrack, "General track not found"),
    ensureNonNil(videoTrack, "Video track not found"),
  ];
}

/**
/**
 * 動画のコーデックを分析します。
 * @param 動画ファイルのパス
 * @returns コーデック
 */
export async function analyzeVideoMediaType(filePath: string): Promise<string> {
  const mediaInfo = await getMediaInfo(filePath);
  return toTypeString(mediaInfo);
}
