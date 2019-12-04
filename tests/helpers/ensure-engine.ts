import { download } from "@prisma/fetch-engine";
import path from "path";
import fs from "fs";

const photonRuntimeDir = path.join(
  __dirname,
  "../../node_modules/@prisma/photon",
);

export default async function ensureQueryEngineExists() {
  if (!fs.existsSync(photonRuntimeDir)) {
    throw new Error("Missing Photon directory: " + photonRuntimeDir);
  }

  await download({
    binaries: {
      "query-engine": photonRuntimeDir,
    },
    showProgress: true,
  });
}
