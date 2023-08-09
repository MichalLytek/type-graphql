import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

export const fsMkdir = promisify(fs.mkdir);
export const fsWriteFile = promisify(fs.writeFile);

export function parsePath(targetPath: string) {
  const directories: string[] = [];
  const parsedPath = path.parse(path.resolve(targetPath));
  const splitPath = parsedPath.dir.split(path.sep);
  if (parsedPath.root === "/") {
    splitPath[0] = `/${splitPath[0]}`;
  }
  splitPath.reduce((previous: string, next: string) => {
    const directory = path.join(previous, next);
    directories.push(directory);
    return path.join(directory);
  });
  return directories;
}

export async function mkdirRecursive(filePath: string) {
  const directories = parsePath(filePath);
  for (const directory of directories) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await fsMkdir(directory);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "EEXIST") {
        throw err;
      }
    }
  }
}

export function mkdirRecursiveSync(filePath: string) {
  const directories = parsePath(filePath);
  for (const directory of directories) {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
  }
}

export async function outputFile(filePath: string, fileContent: any) {
  try {
    await fsWriteFile(filePath, fileContent);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      throw err;
    }
    await mkdirRecursive(filePath);
    await fsWriteFile(filePath, fileContent);
  }
}

export function outputFileSync(filePath: string, fileContent: any) {
  try {
    fs.writeFileSync(filePath, fileContent);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      throw err;
    }
    mkdirRecursiveSync(filePath);
    fs.writeFileSync(filePath, fileContent);
  }
}
