import { PropertyDeclarationStructure, OptionalKind, Project } from "ts-morph";
import { DMMF } from "@prisma/photon";
import path from "path";

import {
  getFieldTSType,
  getTypeGraphQLType,
  pascalCase,
  selectInputTypeFromTypes,
} from "./helpers";
import { DMMFTypeInfo } from "./types";
import { argsFolderName } from "./config";
import {
  generateTypeGraphQLImports,
  generateInputsImports,
  generateEnumsImports,
} from "./imports";

export default async function generateArgsTypeClassFromArgs(
  project: Project,
  resolverDirPath: string,
  args: DMMF.SchemaArg[],
  methodName: string,
  modelNames: string[],
) {
  const name = `${pascalCase(methodName)}Args`;

  const dirPath = path.resolve(resolverDirPath, argsFolderName);
  const filePath = path.resolve(dirPath, `${name}.ts`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  generateTypeGraphQLImports(sourceFile);
  generateInputsImports(
    sourceFile,
    args
      .map(arg => selectInputTypeFromTypes(arg.inputType))
      .filter(argType => argType.kind === "object")
      .map(argType => argType.type as string)
      .sort(),
    3,
  );
  generateEnumsImports(
    sourceFile,
    args
      .map(field => selectInputTypeFromTypes(field.inputType))
      .filter(argType => argType.kind === "enum")
      .map(argType => argType.type as string)
      .sort(),
    3,
  );

  sourceFile.addClass({
    name,
    isExported: true,
    decorators: [
      {
        name: "ArgsType",
        arguments: [],
      },
    ],
    properties: args.map<OptionalKind<PropertyDeclarationStructure>>(arg => {
      const inputType = selectInputTypeFromTypes(arg.inputType);
      const isOptional = !inputType.isRequired;

      return {
        name: arg.name,
        type: getFieldTSType(inputType as DMMFTypeInfo, modelNames),
        hasExclamationToken: !isOptional,
        hasQuestionToken: isOptional,
        trailingTrivia: "\r\n",
        decorators: [
          {
            name: "Field",
            arguments: [
              `_type => ${getTypeGraphQLType(
                inputType as DMMFTypeInfo,
                modelNames,
              )}`,
              `{ nullable: ${isOptional} }`,
            ],
          },
        ],
      };
    }),
  });

  // FIXME: use generic save source file utils
  sourceFile.formatText({ indentSize: 2 });
  await sourceFile.save();

  return name;
}
