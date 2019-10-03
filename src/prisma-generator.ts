import { GeneratorFunction } from "@prisma/cli";
import { DMMF } from "@prisma/photon";
import fs from "fs";
import path from "path";

import generateCode from "./generator";

const defaultOutput = "node_modules/@generated/type-graphql";

export const generate: GeneratorFunction = async options => {
  const outputDir = options.generator.output
    ? path.resolve(options.cwd, options.generator.output)
    : defaultOutput; // TODO: find node_modules dir
  const dmmf = options.dmmf as DMMF.Document;
  const photonDmmf = require(options.otherGenerators.find(
    it => it.provider === "photonjs",
  )!.output!).dmmf as DMMF.Document;

  fs.writeFileSync(
    path.resolve(outputDir, "./dmmf.json"),
    JSON.stringify(dmmf, null, 2),
  );
  fs.writeFileSync(
    path.resolve(outputDir, "./photon-dmmf.json"),
    JSON.stringify(photonDmmf, null, 2),
  );

  await generateCode(photonDmmf, path.resolve(outputDir, "./index.ts"));
  return "";
};
