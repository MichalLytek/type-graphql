import { DMMF as PrismaDMMF } from "@prisma/client/runtime/dmmf-types";
import { Project, ScriptTarget, ModuleKind, CompilerOptions } from "ts-morph";
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
import { GenerateCodeOptions } from "./options";
import { DmmfDocument } from "./dmmf/dmmf-document";
import generateArgsTypeClassFromArgs from "./args-class";
import generateActionResolverClass from "./resolvers/separate-action";

const baseCompilerOptions: CompilerOptions = {
  target: ScriptTarget.ES2019,
  module: ModuleKind.CommonJS,
  emitDecoratorMetadata: true,
  experimentalDecorators: true,
};

export default async function generateCode(
  dmmf: PrismaDMMF.Document,
  options: GenerateCodeOptions,
  log: (msg: string) => void = noop,
) {
  const baseDirPath = options.outputDirPath;
  const emitTranspiledCode =
    options.emitTranspiledCode ??
    options.outputDirPath.includes("node_modules");
  const project = new Project({
    compilerOptions: {
      ...baseCompilerOptions,
      ...(emitTranspiledCode && { declaration: true }),
    },
  });
  const resolversDirPath = path.resolve(baseDirPath, resolversFolderName);
  const modelNames = dmmf.datamodel.models.map(model => model.name);

  log("Transforming dmmfDocument...");
  const dmmfDocument = new DmmfDocument(dmmf, options);

  log("Generating enums...");
  const datamodelEnumNames = dmmfDocument.datamodel.enums.map(
    enumDef => enumDef.typeName,
  );
  dmmfDocument.datamodel.enums.forEach(enumDef =>
    generateEnumFromDef(project, baseDirPath, enumDef),
  );
  dmmfDocument.schema.enums
    // skip enums from datamodel
    .filter(enumDef => !datamodelEnumNames.includes(enumDef.typeName))
    .forEach(enumDef => generateEnumFromDef(project, baseDirPath, enumDef));
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

  log("Generating models...");
  dmmfDocument.datamodel.models.forEach(model =>
    generateObjectTypeClassFromModel(project, baseDirPath, model, dmmfDocument),
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
  outputTypesToGenerate.forEach(type =>
    generateOutputTypeClassFromType(
      project,
      resolversDirPath,
      type,
      dmmfDocument,
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

  if (outputTypesFieldsArgsToGenerate.length > 0) {
    log("Generating output types args...");
    outputTypesFieldsArgsToGenerate.forEach(async field => {
      generateArgsTypeClassFromArgs(
        project,
        path.resolve(resolversDirPath, outputsFolderName),
        field.args,
        field.argsTypeName!,
        dmmfDocument,
        2,
      );
    });
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
  }

  log("Generating input types...");
  dmmfDocument.schema.inputTypes.forEach(type =>
    generateInputTypeClassFromType(
      project,
      resolversDirPath,
      type,
      dmmfDocument,
      options,
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

  if (dmmfDocument.relationModels.length > 0) {
    log("Generating relation resolvers...");
    dmmfDocument.relationModels.forEach(relationModel =>
      generateRelationsResolverClassesFromModel(
        project,
        baseDirPath,
        dmmfDocument,
        relationModel,
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

    log("Generating relation resolver args...");
    dmmfDocument.relationModels.forEach(async relationModelData => {
      const resolverDirPath = path.resolve(
        baseDirPath,
        resolversFolderName,
        relationsResolversFolderName,
        relationModelData.model.typeName,
      );
      relationModelData.relationFields
        .filter(field => field.argsTypeName)
        .forEach(async field => {
          generateArgsTypeClassFromArgs(
            project,
            resolverDirPath,
            field.outputTypeField.args,
            field.argsTypeName!,
            dmmfDocument,
          );
        });
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
      }
    });
  }

  log("Generating crud resolvers...");
  dmmfDocument.mappings.forEach(async mapping => {
    const model = dmmfDocument.datamodel.models.find(
      model => model.name === mapping.model,
    )!;
    generateCrudResolverClassFromMapping(
      project,
      baseDirPath,
      mapping,
      model,
      dmmfDocument,
    );
    mapping.actions.forEach(async action => {
      const model = dmmfDocument.datamodel.models.find(
        model => model.name === mapping.model,
      )!;
      generateActionResolverClass(
        project,
        baseDirPath,
        model,
        action,
        mapping,
        dmmfDocument,
      );
    });
  });
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

  log("Generating crud resolvers args...");
  dmmfDocument.mappings.forEach(async mapping => {
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
      actionsWithArgs.forEach(async action => {
        generateArgsTypeClassFromArgs(
          project,
          resolverDirPath,
          action.method.args,
          action.argsTypeName!,
          dmmfDocument,
        );
      });
      const barrelExportSourceFile = project.createSourceFile(
        path.resolve(resolverDirPath, argsFolderName, "index.ts"),
        undefined,
        { overwrite: true },
      );
      generateArgsBarrelFile(
        barrelExportSourceFile,
        actionsWithArgs.map(it => it.argsTypeName!),
      );
    }
  });

  log("Generating index file");
  const indexSourceFile = project.createSourceFile(
    baseDirPath + "/index.ts",
    undefined,
    { overwrite: true },
  );
  generateIndexFile(indexSourceFile, dmmfDocument.relationModels.length > 0);

  log("Emitting generated code files");
  if (emitTranspiledCode) {
    await project.emit();
  } else {
    for (const file of project.getSourceFiles()) {
      file.formatText({ indentSize: 2 });
    }
    await project.save();
  }
}
