import { GeneratorOptions } from "@prisma/generator-helper";
import { DMMF } from "@prisma/client/runtime";
import { promises as asyncFs } from "fs";
import path from "path";

import generateCode from "../generator/generate-code";
import removeDir from "../utils/removeDir";
import { GenerateCodeOptions } from "../generator/options";

export async function generate(options: GeneratorOptions) {
  const outputDir = options.generator.output!;
  await asyncFs.mkdir(outputDir, { recursive: true });
  await removeDir(outputDir, true);

  const prismaClientDmmf = require(options.otherGenerators.find(
    it => it.provider === "prisma-client-js",
  )!.output!).dmmf as DMMF.Document;

  const config: GenerateCodeOptions = {
    ...options.generator.config,
    outputDirPath: outputDir,
  };

  if (config.emitDMMF) {
    await Promise.all([
      asyncFs.writeFile(
        path.resolve(outputDir, "./dmmf.json"),
        JSON.stringify(options.dmmf, null, 2),
      ),
      asyncFs.writeFile(
        path.resolve(outputDir, "./prisma-client-dmmf.json"),
        JSON.stringify(prismaClientDmmf, null, 2),
      ),
    ]);
  }

  // TODO: replace with `options.dmmf` when the spec match prisma client output
  await generateCode(prismaClientDmmf, config);
  return "";
}
