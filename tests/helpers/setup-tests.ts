import path from "path";
import fs from "fs";

import removeDir from "../../src/utils/removeDir";
import ensurePrismaEngine from "./ensure-engine";

async function setupTests() {
  const artifactsDirPath = path.join(__dirname, "../artifacts");

  if (fs.existsSync(artifactsDirPath)) {
    console.log("cleaning artifacts dir...");
    await removeDir(path.join(__dirname, "../artifacts"), true);
    console.log("cleaned!");
  }

  await ensurePrismaEngine();
}

setupTests()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
