import { PropertyDeclarationStructure, OptionalKind, Project } from "ts-morph";
import path from "path";

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
  fields: DMMF.SchemaArg[],
  argsTypeName: string,
  dmmfDocument: DmmfDocument,
  inputImportsLevel = 3,
) {
  const dirPath = path.resolve(generateDirPath, argsFolderName);
  const filePath = path.resolve(dirPath, `${argsTypeName}.ts`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  generateTypeGraphQLImport(sourceFile);
  generateGraphQLScalarImport(sourceFile);
  generateInputsImports(
    sourceFile,
    fields
      .map(arg => arg.selectedInputType)
      .filter(argInputType => argInputType.kind === "object")
      .map(argInputType => argInputType.type),
    inputImportsLevel,
  );
  generateEnumsImports(
    sourceFile,
    fields
      .map(field => field.selectedInputType)
      .filter(argType => argType.kind === "enum")
      .map(argType => argType.type as string),
    4,
  );

  sourceFile.addClass({
    name: argsTypeName,
    isExported: true,
    decorators: [
      {
        name: "TypeGraphQL.ArgsType",
        arguments: [],
      },
    ],
    properties: fields.map<OptionalKind<PropertyDeclarationStructure>>(arg => {
      const isOptional = !arg.selectedInputType.isRequired;

      return {
        name: arg.typeName,
        type: arg.fieldTSType,
        hasExclamationToken: !isOptional,
        hasQuestionToken: isOptional,
        trailingTrivia: "\r\n",
        decorators: [
          {
            name: "TypeGraphQL.Field",
            arguments: [
              `_type => ${arg.typeGraphQLType}`,
              `{ nullable: ${isOptional} }`,
            ],
          },
        ],
      };
    }),
  });

  await saveSourceFile(sourceFile);
}
