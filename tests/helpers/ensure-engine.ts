import { download } from "@prisma/fetch-engine";
import path from "path";
import fs from "fs";

const prismaClientRuntimeDir = path.join(
  __dirname,
  "../../node_modules/@prisma/client",
);

export default async function ensurePrismaEngine() {
  if (!fs.existsSync(prismaClientRuntimeDir)) {
    throw new Error(
      "Missing PrismaClient directory: " + prismaClientRuntimeDir,
    );
  }

  await download({
    binaries: {
      "query-engine": prismaClientRuntimeDir,
    },
    showProgress: true,
    version: require("@prisma/cli/package.json").prisma.version,
  });
}
