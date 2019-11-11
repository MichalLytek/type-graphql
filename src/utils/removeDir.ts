import path from "path";
import { promises as fs } from "fs";

export default async function removeDir(dirPath: string, onlyContent: boolean) {
  const dirEntries = await fs.readdir(dirPath, { withFileTypes: true });
  await Promise.all(
    dirEntries.map(async dirEntry => {
      const fullPath = path.join(dirPath, dirEntry.name);
      return dirEntry.isDirectory()
        ? await removeDir(fullPath, false)
        : await fs.unlink(fullPath);
    }),
  );
  if (!onlyContent) {
    await fs.rmdir(dirPath);
  }
}
