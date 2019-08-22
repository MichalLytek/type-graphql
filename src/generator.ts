import { GeneratorFunction } from "@prisma/cli";
import { DMMF } from "@prisma/photon/dist/runtime/dmmf-types";
import fs from "fs";
import path from "path";

import generator from "./generator/generator";

const defaultOutput = "node_modules/@generated/type-graphql";

export const generate: GeneratorFunction = async ({
  generator: generatorConfig,
  dmmf,
  cwd,
}) => {
  const outputDir = generatorConfig.output
    ? path.resolve(cwd, generatorConfig.output)
    : defaultOutput; // TODO: find node_modules dir

  const datamodel: DMMF.Datamodel = dmmf.datamodel;
  fs.writeFileSync(
    path.resolve(outputDir, "./dmmf-datamodel.json"),
    JSON.stringify(datamodel, null, 2),
  );
  await generator(datamodel, path.resolve(outputDir, "./index.ts"));

  return "";
};
