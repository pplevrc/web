import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { AVC } from "media-codecs";
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

  const codecId = ensureNonNil(videoTrack.CodecID, "CodecID not found");

  const codecs = (() => {
    switch (format.toLowerCase()) {
      case "avc":
        return toAVCCodecs(videoTrack);
      case "vp9":
        return toVp9Codecs(videoTrack);
      case "av1":
        return toAv1Codecs(videoTrack);
      default:
        throw new Error(`Unsupported codec: ${codecId}`);
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

function toVp9Codecs(_videoTrack: VideoTrack): string {
  throw new Error("Not implemented");
}

function toAv1Codecs(_videoTrack: VideoTrack): string {
  throw new Error("Not implemented");
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
