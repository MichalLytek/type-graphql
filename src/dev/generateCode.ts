import { DMMF } from "@prisma/photon/dist/runtime/dmmf-types";

import generateCode from "../generator/generate-code";

export async function generate(dmmfJSONPath: string, outputTSFilePath: string) {
  console.log("Loading datamodel...");
  const dmmf = require(dmmfJSONPath) as DMMF.Document;

  await generateCode(dmmf, outputTSFilePath, console.log);
}
