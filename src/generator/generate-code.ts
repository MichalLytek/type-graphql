import { DMMF as PrismaDMMF } from "@prisma/client/runtime/dmmf-types";
import { Project } from "ts-morph";
import path from "path";

import { noop } from "./helpers";
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
import generateArgsTypeClassFromArgs from "./args-class";

export default async function generateCode(
  dmmf: PrismaDMMF.Document,
  options: GenerateCodeOptions,
  log: (msg: string) => void = noop,
) {
  const baseDirPath = options.outputDirPath;
  const project = new Project();
  const resolversDirPath = path.resolve(baseDirPath, resolversFolderName);
  const modelNames = dmmf.datamodel.models.map(model => model.name);

  log("Transforming dmmfDocument...");
  const dmmfDocument = new DmmfDocument(dmmf, options);

  log("Generating enums...");
  const datamodelEnumNames = dmmfDocument.datamodel.enums.map(
    enumDef => enumDef.typeName,
  );
  await Promise.all(
    dmmfDocument.datamodel.enums.map(enumDef =>
      generateEnumFromDef(project, baseDirPath, enumDef),
    ),
  );
  await Promise.all(
    dmmfDocument.schema.enums
      // skip enums from datamodel
      .filter(enumDef => !datamodelEnumNames.includes(enumDef.typeName))
      .map(enumDef => generateEnumFromDef(project, baseDirPath, enumDef)),
  );
  const emittedEnumNames = [
    ...new Set([
      ...dmmfDocument.schema.enums.map(it => it.typeName),
      ...dmmfDocument.datamodel.enums.map(it => it.typeName),
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
        options,
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
  const outputTypesFieldsArgsToGenerate = outputTypesToGenerate
    .map(it => it.fields)
    .reduce((a, b) => a.concat(b), [])
    .filter(it => it.argsTypeName);
  await Promise.all(
    outputTypesToGenerate.map(type =>
      generateOutputTypeClassFromType(
        project,
        resolversDirPath,
        type,
        dmmfDocument,
        options,
      ),
    ),
  );
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
    outputTypesToGenerate.map(it => it.typeName),
    outputTypesFieldsArgsToGenerate.length > 0,
  );
  await saveSourceFile(outputsBarrelExportSourceFile);

  if (outputTypesFieldsArgsToGenerate.length > 0) {
    log("Generating output types args...");
    await Promise.all(
      outputTypesFieldsArgsToGenerate.map(async field => {
        await generateArgsTypeClassFromArgs(
          project,
          path.resolve(resolversDirPath, outputsFolderName),
          field.args,
          field.argsTypeName!,
          dmmfDocument,
          2,
        );
      }),
    );
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
    generateArgsBarrelFile(
      outputsArgsBarrelExportSourceFile,
      outputTypesFieldsArgsToGenerate.map(it => it.argsTypeName!),
    );
    await saveSourceFile(outputsArgsBarrelExportSourceFile);
  }

  log("Generating input types...");
  await Promise.all(
    dmmfDocument.schema.inputTypes.map(type =>
      generateInputTypeClassFromType(
        project,
        resolversDirPath,
        type,
        dmmfDocument,
        options,
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
    dmmfDocument.schema.inputTypes.map(it => it.typeName),
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
