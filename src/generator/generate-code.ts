import { DMMF } from "@prisma/photon/dist/runtime/dmmf-types";
import { Project } from "ts-morph";

import { noop } from "./helpers";
import generateImports from "./imports";
import generateEnumsFromDef from "./enums";
import generateObjectTypeClassFromModel from "./object-type-classes";
import generateRelationsResolverClassFromModel from "./relations-resolver-classes";
import generateOutputTypeClassFromType from "./type-class";

export default async function generateCode(
  dmmf: DMMF.Document,
  filePath: string,
  log: (msg: string) => void = noop,
) {
  const project = new Project();
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  log("Generating imports...");
  await generateImports(sourceFile);

  log("Generating enums...");
  await Promise.all(
    dmmf.datamodel.enums.map(enumDef =>
      generateEnumsFromDef(sourceFile, enumDef),
    ),
  );

  log("Generating models...");
  const modelNames = dmmf.datamodel.models.map(model => model.name);
  await Promise.all(
    dmmf.datamodel.models.map(model =>
      generateObjectTypeClassFromModel(sourceFile, model, modelNames),
    ),
  );

  log("Generating output types...");
  await Promise.all(
    dmmf.schema.outputTypes
      // skip generating models and resolvers
      .filter(type => ![...modelNames, "Query", "Mutation"].includes(type.name))
      .map(type =>
        generateOutputTypeClassFromType(sourceFile, type, modelNames),
      ),
  );

  log("Generating relation resolvers...");
  await Promise.all(
    dmmf.datamodel.models.map(model =>
      generateRelationsResolverClassFromModel(sourceFile, model, modelNames),
    ),
  );

  log("Formating generated code...");
  // sourceFile.fixUnusedIdentifiers();
  sourceFile.formatText({ indentSize: 2 });

  log("Saving generated code...");
  await sourceFile.save();
}
