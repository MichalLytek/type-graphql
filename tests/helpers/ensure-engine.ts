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
})
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
