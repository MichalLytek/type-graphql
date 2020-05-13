import { DMMF } from "@prisma/client/runtime/dmmf-types";
import { Project } from "ts-morph";
import path from "path";

import { noop, getInputTypeName } from "./helpers";
import generateEnumFromDef from "./enum";
import generateObjectTypeClassFromModel from "./model-type-class";
import generateRelationsResolverClassesFromModel from "./resolvers/relations";
import {
  generateOutputTypeClassFromType,
  generateInputTypeClassFromType,
} from "./type-class";
import generateCrudResolverClassFromMapping from "./resolvers/full-crud";
import {
  resolversFolderName,
  relationsResolversFolderName,
  crudResolversFolderName,
  inputsFolderName,
  outputsFolderName,
  enumsFolderName,
  modelsFolderName,
  argsFolderName,
} from "./config";
import {
  generateResolversBarrelFile,
  generateInputsBarrelFile,
  generateOutputsBarrelFile,
  generateIndexFile,
  generateModelsBarrelFile,
  generateEnumsBarrelFile,
  generateArgsBarrelFile,
} from "./imports";
import saveSourceFile from "../utils/saveSourceFile";
import { GenerateCodeOptions } from "./options";
import { DmmfDocument } from "./dmmf/dmmf-document";

export default async function generateCode(
  dmmf: DMMF.Document,
  options: GenerateCodeOptions,
  log: (msg: string) => void = noop,
) {
  const baseDirPath = options.outputDirPath;
  const project = new Project();
  const resolversDirPath = path.resolve(baseDirPath, resolversFolderName);
  const modelNames = dmmf.datamodel.models.map(model => model.name);

  log("Transforming dmmfDocument...");
  const dmmfDocument = new DmmfDocument(dmmf);

  log("Generating enums...");
  const datamodelEnumNames = dmmfDocument.datamodel.enums.map(
    enumDef => enumDef.name,
  );
  await Promise.all(
    dmmfDocument.datamodel.enums.map(enumDef =>
      generateEnumFromDef(project, baseDirPath, enumDef),
    ),
  );
  await Promise.all(
    dmmfDocument.schema.enums
      // skip enums from datamodel
      .filter(enumDef => !datamodelEnumNames.includes(enumDef.name))
      .map(enumDef => generateEnumFromDef(project, baseDirPath, enumDef)),
  );
  const emittedEnumNames = [
    ...new Set([
      ...dmmfDocument.schema.enums.map(it => it.name),
      ...dmmfDocument.datamodel.enums.map(it => it.name),
    ]),
  ];
  const enumsBarrelExportSourceFile = project.createSourceFile(
    path.resolve(baseDirPath, enumsFolderName, "index.ts"),
    undefined,
    { overwrite: true },
  );
  generateEnumsBarrelFile(enumsBarrelExportSourceFile, emittedEnumNames);
  await saveSourceFile(enumsBarrelExportSourceFile);

  log("Generating models...");
  await Promise.all(
    dmmfDocument.datamodel.models.map(model =>
      generateObjectTypeClassFromModel(
        project,
        baseDirPath,
        model,
        dmmfDocument,
      ),
    ),
  );
  const modelsBarrelExportSourceFile = project.createSourceFile(
    path.resolve(baseDirPath, modelsFolderName, "index.ts"),
    undefined,
    { overwrite: true },
  );
  generateModelsBarrelFile(
    modelsBarrelExportSourceFile,
    dmmfDocument.datamodel.models.map(it => it.typeName),
  );
  await saveSourceFile(modelsBarrelExportSourceFile);

  log("Generating output types...");
  const rootTypes = dmmfDocument.schema.outputTypes.filter(type =>
    ["Query", "Mutation"].includes(type.name),
  );
  const outputTypesToGenerate = dmmfDocument.schema.outputTypes.filter(
    // skip generating models and root resolvers
    type => !modelNames.includes(type.name) && !rootTypes.includes(type),
  );
  const outputTypesInfo = await Promise.all(
    outputTypesToGenerate.map(type =>
      generateOutputTypeClassFromType(
        project,
        resolversDirPath,
        type,
        dmmfDocument,
      ),
    ),
  );
  const argsTypesNames = outputTypesInfo
    .map(it => it.fieldArgsTypeNames)
    .reduce((a, b) => a.concat(b), []);
  const outputsArgsBarrelExportSourceFile = project.createSourceFile(
    path.resolve(
      baseDirPath,
      resolversFolderName,
      outputsFolderName,
      argsFolderName,
      "index.ts",
    ),
    undefined,
    { overwrite: true },
  );
  generateArgsBarrelFile(outputsArgsBarrelExportSourceFile, argsTypesNames);
  await saveSourceFile(outputsArgsBarrelExportSourceFile);

  const outputsBarrelExportSourceFile = project.createSourceFile(
    path.resolve(
      baseDirPath,
      resolversFolderName,
      outputsFolderName,
      "index.ts",
    ),
    undefined,
    { overwrite: true },
  );
  generateOutputsBarrelFile(
    outputsBarrelExportSourceFile,
    outputTypesInfo.map(it => it.typeName),
    argsTypesNames.length > 0,
  );
  await saveSourceFile(outputsBarrelExportSourceFile);

  log("Generating input types...");
  const inputTypesToEmit = dmmfDocument.schema.inputTypes.filter(
    type => type.name !== "JsonFilter",
  );
  await Promise.all(
    inputTypesToEmit.map(type =>
      generateInputTypeClassFromType(
        project,
        resolversDirPath,
        type,
        dmmfDocument,
      ),
    ),
  );
  const inputsBarrelExportSourceFile = project.createSourceFile(
    path.resolve(
      baseDirPath,
      resolversFolderName,
      inputsFolderName,
      "index.ts",
    ),
    undefined,
    { overwrite: true },
  );
  generateInputsBarrelFile(
    inputsBarrelExportSourceFile,
    inputTypesToEmit.map(it => getInputTypeName(it.name, dmmfDocument)),
  );
  await saveSourceFile(inputsBarrelExportSourceFile);

  log("Generating relation resolvers...");
  const relationResolversData = await Promise.all(
    dmmfDocument.datamodel.models
      .filter(model => model.fields.some(field => field.relationName))
      .map(model => {
        const outputType = dmmfDocument.schema.outputTypes.find(
          type => type.name === model.name,
        )!;
        const mapping = dmmfDocument.mappings.find(
          it => it.model === model.name,
        )!;
        return generateRelationsResolverClassesFromModel(
          project,
          baseDirPath,
          model,
          mapping,
          outputType,
          dmmfDocument,
        );
      }),
  );
  if (relationResolversData.length > 0) {
    const relationResolversBarrelExportSourceFile = project.createSourceFile(
      path.resolve(
        baseDirPath,
        resolversFolderName,
        relationsResolversFolderName,
        "index.ts",
      ),
      undefined,
      { overwrite: true },
    );
    generateResolversBarrelFile(
      "relations",
      relationResolversBarrelExportSourceFile,
      relationResolversData,
    );
    await saveSourceFile(relationResolversBarrelExportSourceFile);
  }

  log("Generating crud resolvers...");
  const crudResolversData = await Promise.all(
    dmmfDocument.mappings.map(mapping => {
      const model = dmmfDocument.datamodel.models.find(
        model => model.name === mapping.model,
      )!;
      return generateCrudResolverClassFromMapping(
        project,
        baseDirPath,
        mapping,
        model,
        rootTypes,
        modelNames,
        options,
        dmmfDocument,
      );
    }),
  );
  const crudResolversBarrelExportSourceFile = project.createSourceFile(
    path.resolve(
      baseDirPath,
      resolversFolderName,
      crudResolversFolderName,
      "index.ts",
    ),
    undefined,
    { overwrite: true },
  );
  generateResolversBarrelFile(
    "crud",
    crudResolversBarrelExportSourceFile,
    crudResolversData,
  );
  await saveSourceFile(crudResolversBarrelExportSourceFile);

  log("Generating index file");
  const indexSourceFile = project.createSourceFile(
    baseDirPath + "/index.ts",
    undefined,
    { overwrite: true },
  );
  generateIndexFile(indexSourceFile, relationResolversData.length > 0);
  await saveSourceFile(indexSourceFile);
}
