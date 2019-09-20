import { DMMF } from "@prisma/photon";
import { Project } from "ts-morph";

import { noop } from "./helpers";
import generateImports from "./imports";
import generateEnumFromDef from "./enum";
import generateObjectTypeClassFromModel from "./object-type-class";
import generateRelationsResolverClassFromModel from "./relations-resolver-class";
import {
  generateOutputTypeClassFromType,
  generateInputTypeClassFromType,
} from "./type-class";
import generateCrudResolverClassFromRootType from "./crud-resolver-class";

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
  const datamodelEnumNames = dmmf.datamodel.enums.map(enumDef => enumDef.name);
  await Promise.all(
    dmmf.datamodel.enums.map(enumDef =>
      generateEnumFromDef(sourceFile, enumDef),
    ),
  );
  await Promise.all(
    dmmf.schema.enums
      // skip enums from datamodel
      .filter(enumDef => !datamodelEnumNames.includes(enumDef.name))
      .map(enumDef => generateEnumFromDef(sourceFile, enumDef)),
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

  log("Generating input types...");
  await Promise.all(
    dmmf.schema.inputTypes.map(type =>
      generateInputTypeClassFromType(sourceFile, type, modelNames),
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
