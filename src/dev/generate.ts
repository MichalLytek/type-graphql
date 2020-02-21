import { DMMF } from "@prisma/client/runtime";

import generateCode from "../generator/generate-code";

export default async function generate(
  dmmfJSONPath: string,
  outputTSFilePath: string,
) {
  console.log("Loading datamodel...");
  const dmmf = require(dmmfJSONPath) as DMMF.Document;

  await generateCode(dmmf, { outputDirPath: outputTSFilePath }, console.log);
}
