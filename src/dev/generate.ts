import { DMMF as PrismaDMMF } from "@prisma/client/runtime";

import generateCode from "../generator/generate-code";

export default async function generate(
  dmmfJSONPath: string,
  outputTSFilePath: string,
) {
  console.log("Loading datamodel...");
  const dmmf = require(dmmfJSONPath) as PrismaDMMF.Document;

  await generateCode(
    dmmf,
    {
      outputDirPath: outputTSFilePath,
      relativePrismaOutputPath: "../client",
    },
    console.log,
  );
}
