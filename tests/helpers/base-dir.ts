import path from "path";

export default function getBaseDirPath(folderSuffix: string): string {
  return path.join(__dirname, "../artifacts", `${Date.now()}-${folderSuffix}`);
}
