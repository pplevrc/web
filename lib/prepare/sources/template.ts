import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { render } from "ejs";
import { globby } from "globby";
import { hash } from "ohash";

const renderContext = {
  hash,
};

async function main() {
  await generate();
}

async function generate() {
  const files = await findAllEJSFiles();
  await Promise.all(files.map((v) => prepareTemplate(v)));
}

async function findAllEJSFiles(rootDir = process.cwd()): Promise<string[]> {
  return (await globby([`${rootDir}/**/*.ejs`, "!**/*.generated.*"])).map(
    (filePath) => filePath.replace(`${rootDir}/`, ""),
  );
}

async function prepareTemplate(
  filePath: string,
  rootDir = process.cwd(),
): Promise<void> {
  try {
    const content = await readFile(resolve(rootDir, filePath), "utf-8");
    const result = render(content, renderContext);
    const generatedFileName = toGeneratedFileName(filePath);
    await writeFile(resolve(rootDir, generatedFileName), result, {
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
