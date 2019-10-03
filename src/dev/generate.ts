import { DMMF } from "@prisma/photon";

import generateCode from "../generator";

export default async function generate(
  dmmfJSONPath: string,
  outputTSFilePath: string,
) {
  console.log("Loading datamodel...");
  const dmmf = require(dmmfJSONPath) as DMMF.Document;

  await generateCode(dmmf, outputTSFilePath, console.log);
}
