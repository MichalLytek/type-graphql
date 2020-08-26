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
import generateActionResolverClass from "./resolvers/separate-action";

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

  if (dmmfDocument.relationModels.length > 0) {
    log("Generating relation resolvers...");
    await Promise.all(
      dmmfDocument.relationModels.map(relationModel =>
        generateRelationsResolverClassesFromModel(
          project,
          baseDirPath,
          dmmfDocument,
          relationModel,
        ),
      ),
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
      dmmfDocument.relationModels.map(relationModel => ({
        resolverName: relationModel.resolverName,
        modelName: relationModel.model.typeName,
        hasSomeArgs: relationModel.relationFields.some(
          field => field.argsTypeName !== undefined,
        ),
      })),
    );
    await saveSourceFile(relationResolversBarrelExportSourceFile);

    log("Generating relation resolver args...");
    await Promise.all(
      dmmfDocument.relationModels.map(async relationModelData => {
        const resolverDirPath = path.resolve(
          baseDirPath,
          resolversFolderName,
          relationsResolversFolderName,
          relationModelData.model.typeName,
        );
        await Promise.all(
          relationModelData.relationFields
            .filter(field => field.argsTypeName)
            .map(async field => {
              await generateArgsTypeClassFromArgs(
                project,
                resolverDirPath,
                field.outputTypeField.args,
                field.argsTypeName!,
                dmmfDocument,
              );
            }),
        );
        const argTypeNames = relationModelData.relationFields
          .filter(it => it.argsTypeName !== undefined)
          .map(it => it.argsTypeName!);

        if (argTypeNames.length) {
          const barrelExportSourceFile = project.createSourceFile(
            path.resolve(resolverDirPath, argsFolderName, "index.ts"),
            undefined,
            { overwrite: true },
          );
          generateArgsBarrelFile(barrelExportSourceFile, argTypeNames);
          await saveSourceFile(barrelExportSourceFile);
        }
      }),
    );
  }

  log("Generating crud resolvers...");
  await Promise.all(
    dmmfDocument.mappings.map(async mapping => {
      const model = dmmfDocument.datamodel.models.find(
        model => model.name === mapping.model,
      )!;
      await generateCrudResolverClassFromMapping(
        project,
        baseDirPath,
        mapping,
        model,
        dmmfDocument,
      );
    }),
  );
  await Promise.all(
    dmmfDocument.mappings.map(
      async mapping =>
        await Promise.all(
          mapping.actions.map(async action => {
            const model = dmmfDocument.datamodel.models.find(
              model => model.name === mapping.model,
            )!;
            await generateActionResolverClass(
              project,
              baseDirPath,
              model,
              action,
              mapping,
              dmmfDocument,
            );
          }),
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
    dmmfDocument.mappings.map(mapping => {
      const model = dmmfDocument.datamodel.models.find(
        model => model.name === mapping.model,
      )!;
      return {
        modelName: model.typeName,
        resolverName: mapping.resolverName,
        actionResolverNames: mapping.actions.map(it => it.actionResolverName),
        hasSomeArgs: mapping.actions.some(
          action => action.argsTypeName !== undefined,
        ),
      };
    }),
  );
  await saveSourceFile(crudResolversBarrelExportSourceFile);

  log("Generating crud resolvers args...");
  await Promise.all(
    dmmfDocument.mappings.map(async mapping => {
      const actionsWithArgs = mapping.actions.filter(
        it => it.argsTypeName !== undefined,
      );

      if (actionsWithArgs.length) {
        const model = dmmfDocument.datamodel.models.find(
          model => model.name === mapping.model,
        )!;
        const resolverDirPath = path.resolve(
          baseDirPath,
          resolversFolderName,
          crudResolversFolderName,
          model.typeName,
        );
        await Promise.all(
          actionsWithArgs.map(async action => {
            await generateArgsTypeClassFromArgs(
              project,
              resolverDirPath,
              action.method.args,
              action.argsTypeName!,
              dmmfDocument,
            );
          }),
        );
        const barrelExportSourceFile = project.createSourceFile(
          path.resolve(resolverDirPath, argsFolderName, "index.ts"),
          undefined,
          { overwrite: true },
        );
        generateArgsBarrelFile(
          barrelExportSourceFile,
          actionsWithArgs.map(it => it.argsTypeName!),
        );
        await saveSourceFile(barrelExportSourceFile);
      }
    }),
  );

  log("Generating index file");
  const indexSourceFile = project.createSourceFile(
    baseDirPath + "/index.ts",
    undefined,
    { overwrite: true },
  );
  generateIndexFile(indexSourceFile, dmmfDocument.relationModels.length > 0);
  await saveSourceFile(indexSourceFile);
}
