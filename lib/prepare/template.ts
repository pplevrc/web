import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { render } from "ejs";
import { globby } from "globby";
import { hash } from "ohash";

const renderContext = {
	hash,
};

const ROOT_PATH = resolve(__dirname, "../../");

async function main() {
	await generate();
}

async function generate() {
	const files = await findAllEJSFiles();
	await Promise.all(files.map(prepareTemplate));
}

async function findAllEJSFiles(rootDir = ROOT_PATH): Promise<string[]> {
	return (await globby(`${rootDir}/**/*.ejs`)).map((filePath) =>
		filePath.replace(`${rootDir}/`, ""),
	);
}

async function prepareTemplate(filePath: string): Promise<void> {
	try {
		const content = await readFile(resolve(ROOT_PATH, filePath), "utf-8");
		const result = render(content, renderContext);
		const generatedFileName = toGeneratedFileName(filePath);
		await writeFile(resolve(ROOT_PATH, generatedFileName), result, {
			encoding: "utf-8",
			flag: "w",
		});
		console.log(`Template prepared: ${generatedFileName}`);
	} catch (error) {
		console.error(`Error preparing template: ${filePath}`);
		console.error(error);
	}
}

/**
 * e.g.
 * foo.ts.ejs -> foo.generated.ts
 */
function toGeneratedFileName(filePath: string): string {
	if (!filePath.endsWith(".ejs")) {
		throw new Error(`Invalid file extension: ${filePath}`);
	}

	const withoutEJS = filePath.slice(0, -4);

	const lastDotIndex = withoutEJS.lastIndexOf(".");
	if (lastDotIndex === -1) {
		return `${withoutEJS}.generated`;
	}

	const baseName = withoutEJS.slice(0, lastDotIndex);
	const extension = withoutEJS.slice(lastDotIndex + 1);

	return `${baseName}.generated.${extension}`;
}

main();
