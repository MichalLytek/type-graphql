import { PropertyDeclarationStructure, OptionalKind, Project } from "ts-morph";
import { DMMF } from "@prisma/photon/runtime";
import path from "path";

import {
  getFieldTSType,
  getTypeGraphQLType,
  selectInputTypeFromTypes,
} from "./helpers";
import { DMMFTypeInfo } from "./types";
import { outputsFolderName, inputsFolderName } from "./config";
import {
  generateTypeGraphQLImports,
  generateInputsImports,
  generateEnumsImports,
} from "./imports";
import saveSourceFile from "../utils/saveSourceFile";

export async function generateOutputTypeClassFromType(
  project: Project,
  dirPath: string,
  type: DMMF.OutputType,
  modelNames: string[],
): Promise<void> {
  const filePath = path.resolve(dirPath, outputsFolderName, `${type.name}.ts`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  generateTypeGraphQLImports(sourceFile);

  sourceFile.addClass({
    name: type.name,
    isExported: true,
    decorators: [
      {
        name: "ObjectType",
        arguments: [
          `{
            isAbstract: true,
            description: undefined,
          }`,
        ],
      },
    ],
    properties: type.fields.map<OptionalKind<PropertyDeclarationStructure>>(
      field => {
        const isRequired = field.outputType.isRequired;

        return {
          name: field.name,
          type: getFieldTSType(field.outputType as DMMFTypeInfo, modelNames),
          hasExclamationToken: isRequired,
          hasQuestionToken: !isRequired,
          trailingTrivia: "\r\n",
          decorators: [
            {
              name: "Field",
              arguments: [
                `_type => ${getTypeGraphQLType(
                  field.outputType as DMMFTypeInfo,
                  modelNames,
                )}`,
                `{
                  nullable: ${!isRequired},
                  description: undefined
                }`,
              ],
            },
          ],
        };
      },
    ),
  });

  await saveSourceFile(sourceFile);
}

export async function generateInputTypeClassFromType(
  project: Project,
  dirPath: string,
  type: DMMF.InputType,
  modelNames: string[],
): Promise<void> {
  const filePath = path.resolve(dirPath, inputsFolderName, `${type.name}.ts`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  generateTypeGraphQLImports(sourceFile);
  generateInputsImports(
    sourceFile,
    type.fields
      .map(field => selectInputTypeFromTypes(field.inputType))
      .filter(fieldType => fieldType.kind === "object")
      .map(fieldType => fieldType.type as string)
      .filter(fieldType => fieldType !== type.name),
  );
  generateEnumsImports(
    sourceFile,
    type.fields
      .map(field => selectInputTypeFromTypes(field.inputType))
      .filter(fieldType => fieldType.kind === "enum")
      .map(fieldType => fieldType.type as string),
    2,
  );

  sourceFile.addClass({
    name: type.name,
    isExported: true,
    decorators: [
      {
        name: "InputType",
        arguments: [
          `{
            isAbstract: true,
            description: undefined,
          }`,
        ],
      },
    ],
    properties: type.fields.map<OptionalKind<PropertyDeclarationStructure>>(
      field => {
        const inputType = selectInputTypeFromTypes(field.inputType);
        return {
          name: field.name,
          type: getFieldTSType(inputType as DMMFTypeInfo, modelNames),
          hasExclamationToken: inputType.isRequired,
          hasQuestionToken: !inputType.isRequired,
          trailingTrivia: "\r\n",
          decorators: [
            {
              name: "Field",
              arguments: [
                `_type => ${getTypeGraphQLType(
                  inputType as DMMFTypeInfo,
                  modelNames,
                )}`,
                `{
                  nullable: ${!inputType.isRequired},
                  description: undefined
                }`,
              ],
            },
          ],
        };
      },
    ),
  });

  await saveSourceFile(sourceFile);
}
