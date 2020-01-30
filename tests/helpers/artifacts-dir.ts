import path from "path";

export default function generateArtifactsDirPath(folderSuffix: string): string {
  const randomNumber = Math.random()
    .toFixed(18)
    .slice(2);
  return path.join(
    __dirname,
    "../artifacts",
    `${randomNumber}-${folderSuffix}`,
  );
}
