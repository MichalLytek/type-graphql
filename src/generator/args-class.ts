import { PropertyDeclarationStructure, OptionalKind, Project } from "ts-morph";
import path from "path";

import { getFieldTSType, getTypeGraphQLType, pascalCase } from "./helpers";
import { argsFolderName } from "./config";
import {
  generateTypeGraphQLImport,
  generateInputsImports,
  generateEnumsImports,
  generateGraphQLScalarImport,
} from "./imports";
import saveSourceFile from "../utils/saveSourceFile";
import { DmmfDocument } from "./dmmf/dmmf-document";
import { DMMF } from "./dmmf/types";

export default async function generateArgsTypeClassFromArgs(
  project: Project,
  generateDirPath: string,
  args: DMMF.SchemaArg[],
  methodName: string,
  dmmfDocument: DmmfDocument,
  inputImportsLevel = 3,
) {
  const name = `${pascalCase(methodName)}Args`;
  const dirPath = path.resolve(generateDirPath, argsFolderName);
  const filePath = path.resolve(dirPath, `${name}.ts`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  generateTypeGraphQLImport(sourceFile);
  generateGraphQLScalarImport(sourceFile);
  generateInputsImports(
    sourceFile,
    args
      .map(arg => arg.selectedInputType)
      .filter(argInputType => argInputType.kind === "object")
      .map(argInputType => argInputType.type),
    inputImportsLevel,
  );
  generateEnumsImports(
    sourceFile,
    args
      .map(field => field.selectedInputType)
      .filter(argType => argType.kind === "enum")
      .map(argType => argType.type as string),
    3,
  );

  sourceFile.addClass({
    name,
    isExported: true,
    decorators: [
      {
        name: "TypeGraphQL.ArgsType",
        arguments: [],
      },
    ],
    properties: args.map<OptionalKind<PropertyDeclarationStructure>>(arg => {
      const isOptional = !arg.selectedInputType.isRequired;

      return {
        name: arg.name,
        type: getFieldTSType(arg.selectedInputType, dmmfDocument),
        hasExclamationToken: !isOptional,
        hasQuestionToken: isOptional,
        trailingTrivia: "\r\n",
        decorators: [
          {
            name: "TypeGraphQL.Field",
            arguments: [
              `_type => ${getTypeGraphQLType(
                arg.selectedInputType,
                dmmfDocument,
              )}`,
              `{ nullable: ${isOptional} }`,
            ],
          },
        ],
      };
    }),
  });

  await saveSourceFile(sourceFile);
  return name;
}
