import { globby } from "globby";
import { snapshotPoster, toWebMP4 } from "./ffmpeg";

async function main() {
	await generate();
}

async function generate() {
	const files = await findAllMP4Files();

	for (const file of files) {
		await transportWebMP4(file);
		await snapshot(file);
		// webm, ogg も必要があればやる
	}
}

async function findAllMP4Files(rootDir = process.cwd()): Promise<string[]> {
	return (await globby([`${rootDir}/**/*.mp4`, "!**/*.generated.*"])).map(
		(filePath) => filePath.replace(`${rootDir}/`, ""),
	);
}

async function transportWebMP4(filePath: string): Promise<void> {
	try {
		console.log(`Transporting: ${filePath} to web-optimized mp4`);
		await toWebMP4(filePath, { media: "pc" });
		await toWebMP4(filePath, { media: "sp" });
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
