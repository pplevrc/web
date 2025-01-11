declare module "@ffmpeg/core-mt" {
  export interface FFmpegReadFileData {
    encoding: string;
  }

  export interface FFmpegStat {
    mode: string;
  }

  export interface LogData {
    type: string;
    message: string;
  }

  export interface FFmpegModule {
    FS: FFmpegFSController;

    setLogger(callback: (data: LogData) => void): void;

    setProgress(callback: (data: LogData) => void): void;

    setTimeout(timeout: number): void;

    exec(...args: string[]): ExitCode;

    reset(): void;

    /**
     * @default
     * ```ts
     * new WebAssembly.Memory({ initial: 16384, maximum: 16384, shared: true });
     */
    wasmMemory: WebAssembly.Memory;
  }

  export type Data = Uint8Array | string;

  export interface FFmpegFSController {
    writeFile(path: string, data: Data): void;

    readFile(path: string, opt: FFmpegReadFileData): Data;

    unlink(path: string): void;

    mkdir(path: string): void;

    readdir(path: string): string[];

    stat(path: string): Mode;

    rmdir(path: string): void;

    readonly filesystems: Readonly<Record<string, string>>;
  }

  export interface CreateFFmpegCoreOption extends Partial<FFmpegModule> {
    mainScriptUrlOrBlob?: string;
  }

  export default function (
    option?: CreateFFmpegCoreOption,
  ): Promise<FFmpegModule>;
}
