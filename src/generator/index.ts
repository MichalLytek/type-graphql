import { DMMF } from "@prisma/photon";
import { Project } from "ts-morph";
import path from "path";

import { noop } from "./helpers";
import generateEnumFromDef from "./enum";
import generateObjectTypeClassFromModel from "./object-type-class";
import generateRelationsResolverClassFromModel from "./relations-resolver-class";
import {
  generateOutputTypeClassFromType,
  generateInputTypeClassFromType,
} from "./type-class";
import generateCrudResolverClassFromRootType from "./crud-resolver-class";
import {
  resolversFolderName,
  relationsResolversFolderName,
  crudResolversFolderName,
  inputsFolderName,
  outputsFolderName,
  enumsFolderName,
  modelsFolderName,
} from "./config";
import {
  generateResolversBarrelFile,
  generateInputsBarrelFile,
  generateOutputsBarrelFile,
  generateIndexFile,
  generateEnumsImports,
  generateModelsBarrelFile,
} from "./imports";

export default async function generateCode(
  dmmf: DMMF.Document,
  baseDirPath: string,
  log: (msg: string) => void = noop,
) {
  const project = new Project();
  const resolversDirPath = path.resolve(baseDirPath, resolversFolderName);
  const modelNames = dmmf.datamodel.models.map(model => model.name);

  log("Generating enums...");
  const datamodelEnumNames = dmmf.datamodel.enums.map(enumDef => enumDef.name);
  await Promise.all(
    dmmf.datamodel.enums.map(enumDef =>
      generateEnumFromDef(project, baseDirPath, enumDef),
    ),
  );
  await Promise.all(
    dmmf.schema.enums
      // skip enums from datamodel
      .filter(enumDef => !datamodelEnumNames.includes(enumDef.name))
      .map(enumDef => generateEnumFromDef(project, baseDirPath, enumDef)),
  );
  const emittedEnumNames = [
    ...new Set([
      ...dmmf.schema.enums.map(it => it.name),
      ...dmmf.datamodel.enums.map(it => it.name),
    ]),
  ];
  const enumsBarrelExportSourceFile = project.createSourceFile(
    path.resolve(baseDirPath, enumsFolderName, "index.ts"),
    undefined,
    { overwrite: true },
  );
  generateEnumsImports(enumsBarrelExportSourceFile, emittedEnumNames);
  // FIXME: use generic save source file utils
  enumsBarrelExportSourceFile.formatText({ indentSize: 2 });
  await enumsBarrelExportSourceFile.save();

  log("Generating models...");
  await Promise.all(
    dmmf.datamodel.models.map(model =>
      generateObjectTypeClassFromModel(project, baseDirPath, model, modelNames),
    ),
  );
  const modelsBarrelExportSourceFile = project.createSourceFile(
    path.resolve(baseDirPath, modelsFolderName, "index.ts"),
    undefined,
    { overwrite: true },
  );
  generateModelsBarrelFile(
    modelsBarrelExportSourceFile,
    dmmf.datamodel.models.map(it => it.name),
  );
  // FIXME: use generic save source file utils
  modelsBarrelExportSourceFile.formatText({ indentSize: 2 });
  await modelsBarrelExportSourceFile.save();

  log("Generating output types...");
  const rootTypes = dmmf.schema.outputTypes.filter(type =>
    ["Query", "Mutation"].includes(type.name),
  );
  const outputTypesToGenerate = dmmf.schema.outputTypes.filter(
    // skip generating models and root resolvers
    type => !modelNames.includes(type.name) && !rootTypes.includes(type),
  );
  await Promise.all(
    outputTypesToGenerate.map(type =>
      generateOutputTypeClassFromType(
        project,
        resolversDirPath,
        type,
        modelNames,
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
    outputTypesToGenerate.map(it => it.name).sort(),
  );
  // FIXME: use generic save source file utils
  outputsBarrelExportSourceFile.formatText({ indentSize: 2 });
  await outputsBarrelExportSourceFile.save();

  log("Generating input types...");
  await Promise.all(
    dmmf.schema.inputTypes.map(type =>
      generateInputTypeClassFromType(
        project,
        resolversDirPath,
        type,
        modelNames,
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
    dmmf.schema.inputTypes.map(it => it.name).sort(),
  );
  // FIXME: use generic save source file utils
  inputsBarrelExportSourceFile.formatText({ indentSize: 2 });
  await inputsBarrelExportSourceFile.save();

  log("Generating relation resolvers...");
  const relationResolversData = await Promise.all(
    dmmf.datamodel.models.map(model => {
      const outputType = dmmf.schema.outputTypes.find(
        type => type.name === model.name,
      )!;
      return generateRelationsResolverClassFromModel(
        project,
        baseDirPath,
        model,
        outputType,
        modelNames,
      );
    }),
  );
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
  // FIXME: use generic save source file utils
  relationResolversBarrelExportSourceFile.formatText({ indentSize: 2 });
  await relationResolversBarrelExportSourceFile.save();

  log("Generating crud resolvers...");
  const crudResolversData = await Promise.all(
    dmmf.mappings.map(mapping =>
      generateCrudResolverClassFromRootType(
        project,
        baseDirPath,
        mapping,
        rootTypes,
        modelNames,
      ),
    ),
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
  // FIXME: use generic save source file utils
  crudResolversBarrelExportSourceFile.formatText({ indentSize: 2 });
  await crudResolversBarrelExportSourceFile.save();

  log("Generating index file");
  const indexSourceFile = project.createSourceFile(
    baseDirPath + "/index.ts",
    undefined,
    { overwrite: true },
  );
  generateIndexFile(indexSourceFile);
  // FIXME: use generic save source file utils
  // indexSourceFile.fixUnusedIdentifiers();
  indexSourceFile.formatText({ indentSize: 2 });
  await indexSourceFile.save();
}
