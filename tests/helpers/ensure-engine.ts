import { download } from "@prisma/fetch-engine";
import path from "path";
import fs from "fs";

const photonRuntimeDir = path.join(
  __dirname,
  "../../node_modules/@prisma/photon",
);

if (!fs.existsSync(photonRuntimeDir)) {
  throw new Error("Missing Photon directory: " + photonRuntimeDir);
}

download({
  binaries: {
    "query-engine": photonRuntimeDir,
  },
  showProgress: true,
})
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
