import path from "path";

export default function generateArtifactsDirPath(folderSuffix: string): string {
  return path.join(__dirname, "../artifacts", `${Date.now()}-${folderSuffix}`);
}
