import {
  SourceFile,
  PropertyDeclarationStructure,
  OptionalKind,
  Project,
} from "ts-morph";
import { DMMF } from "@prisma/photon";
import path from "path";

import {
  getFieldTSType,
  getTypeGraphQLType,
  selectInputTypeFromTypes,
} from "./helpers";
import { DMMFTypeInfo } from "./types";
import { inputsFolderName } from "./config";
import {
  generateTypeGraphQLImports,
  generateInputsImports,
  generateEnumsImports,
} from "./imports";

export async function generateOutputTypeClassFromType(
  sourceFile: SourceFile,
  type: DMMF.OutputType,
  modelNames: string[],
): Promise<void> {
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
}

export async function generateInputTypeClassFromType(
  project: Project,
  baseDirPath: string,
  type: DMMF.InputType,
  modelNames: string[],
): Promise<void> {
  const dirPath = path.resolve(baseDirPath, inputsFolderName);
  const filePath = path.resolve(dirPath, `${type.name}.ts`);
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

  // FIXME: use generic save source file utils
  sourceFile.formatText({ indentSize: 2 });
  await sourceFile.save();
}
