import { DMMF } from "@prisma/photon";
import { Project } from "ts-morph";
import path from "path";

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
  baseDirPath: string,
  log: (msg: string) => void = noop,
) {
  const project = new Project();
  const sourceFile = project.createSourceFile(
    baseDirPath + "/index.ts",
    undefined,
    {
      overwrite: true,
    },
  );

  log("Generating imports...");
  await generateImports(sourceFile);

  log("Generating enums...");
  const datamodelEnumNames = dmmf.datamodel.enums.map(enumDef => enumDef.name);
  const enumDirPath = path.resolve(baseDirPath, "./enums");
  await Promise.all(
    dmmf.datamodel.enums.map(enumDef =>
      generateEnumFromDef(project, enumDirPath, enumDef),
    ),
  );
  await Promise.all(
    dmmf.schema.enums
      // skip enums from datamodel
      .filter(enumDef => !datamodelEnumNames.includes(enumDef.name))
      .map(enumDef => generateEnumFromDef(project, enumDirPath, enumDef)),
  );

  log("Generating models...");
  const modelsDirPath = path.resolve(baseDirPath, "./models");
  const modelNames = dmmf.datamodel.models.map(model => model.name);
  await Promise.all(
    dmmf.datamodel.models.map(model =>
      generateObjectTypeClassFromModel(
        project,
        modelsDirPath,
        model,
        modelNames,
      ),
    ),
  );

  log("Generating output types...");
  const rootTypes = dmmf.schema.outputTypes.filter(type =>
    ["Query", "Mutation"].includes(type.name),
  );
  await Promise.all(
    dmmf.schema.outputTypes
      .filter(
        // skip generating models and root resolvers
        type => !modelNames.includes(type.name) && !rootTypes.includes(type),
      )
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
    dmmf.datamodel.models.map(model => {
      const outputType = dmmf.schema.outputTypes.find(
        type => type.name === model.name,
      )!;
      return generateRelationsResolverClassFromModel(
        sourceFile,
        model,
        outputType,
        modelNames,
      );
    }),
  );

  log("Generating crud resolvers...");
  await Promise.all(
    dmmf.mappings.map(mapping =>
      generateCrudResolverClassFromRootType(
        sourceFile,
        mapping,
        rootTypes,
        modelNames,
      ),
    ),
  );

  log("Formating generated code...");
  // sourceFile.fixUnusedIdentifiers();
  sourceFile.formatText({ indentSize: 2 });

  log("Saving generated code...");
  await sourceFile.save();
}
