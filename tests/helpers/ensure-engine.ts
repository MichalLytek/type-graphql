import { download } from "@prisma/fetch-engine";
import path from "path";
import fs from "fs";

const prismaClientRuntimeDir = path.join(
  __dirname,
  "../../node_modules/@prisma/client",
);

if (!fs.existsSync(prismaClientRuntimeDir)) {
  throw new Error("Missing PrismaClient directory: " + prismaClientRuntimeDir);
}

download({
  binaries: {
    "query-engine": prismaClientRuntimeDir,
  },
  showProgress: true,
  version: require("prisma2/package.json").prisma.version,
})
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
