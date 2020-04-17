import {
  PropertyDeclarationStructure,
  OptionalKind,
  Project,
  MethodDeclarationStructure,
} from "ts-morph";
import { DMMF } from "@prisma/client/runtime/dmmf-types";
import path from "path";

import {
  getFieldTSType,
  getTypeGraphQLType,
  selectInputTypeFromTypes,
  camelCase,
  pascalCase,
} from "./helpers";
import { DMMFTypeInfo } from "./types";
import { outputsFolderName, inputsFolderName } from "./config";
import {
  generateTypeGraphQLImports,
  generateInputsImports,
  generateEnumsImports,
  generateArgsImports,
} from "./imports";
import saveSourceFile from "../utils/saveSourceFile";
import generateArgsTypeClassFromArgs from "./args-class";

export async function generateOutputTypeClassFromType(
  project: Project,
  dirPath: string,
  type: DMMF.OutputType,
  modelNames: string[],
): Promise<string[]> {
  const fileDirPath = path.resolve(dirPath, outputsFolderName);
  const filePath = path.resolve(fileDirPath, `${type.name}.ts`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  const fieldsInfo = await Promise.all(
    type.fields.map(async field => {
      let argsTypeName: string | undefined;
      if (field.args.length > 0) {
        argsTypeName = await generateArgsTypeClassFromArgs(
          project,
          fileDirPath,
          field.args,
          `${type.name}${pascalCase(field.name)}`,
          modelNames,
          2,
        );
      }
      return { ...field, argsTypeName };
    }),
  );

  const fieldArgsTypeNames = fieldsInfo
    .filter(it => it.argsTypeName)
    .map(it => it.argsTypeName!);

  generateTypeGraphQLImports(sourceFile);
  generateArgsImports(sourceFile, fieldArgsTypeNames, 0);

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
    properties: fieldsInfo
      .filter(it => it.args.length === 0)
      .map<OptionalKind<PropertyDeclarationStructure>>(field => {
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
      }),
    methods: fieldsInfo
      // TODO: allow also for other fields args
      .filter(it => it.args.length > 0 && type.name.startsWith("Aggregate"))
      .map<OptionalKind<MethodDeclarationStructure>>(fieldInfo => {
        const isRequired = fieldInfo.outputType.isRequired;
        // TODO: make it more future-proof
        const collectionName = camelCase(type.name.replace("Aggregate", ""));

        return {
          name: fieldInfo.name,
          type: getFieldTSType(
            fieldInfo.outputType as DMMFTypeInfo,
            modelNames,
          ),
          trailingTrivia: "\r\n",
          decorators: [
            {
              name: "Field",
              arguments: [
                `_type => ${getTypeGraphQLType(
                  fieldInfo.outputType as DMMFTypeInfo,
                  modelNames,
                )}`,
                `{
                  nullable: ${!isRequired},
                  description: undefined
                }`,
              ],
            },
          ],
          parameters: [
            {
              name: "ctx",
              // TODO: import custom `ContextType`
              type: "any",
              decorators: [{ name: "Ctx", arguments: [] }],
            },
            {
              name: "args",
              type: fieldInfo.argsTypeName,
              decorators: [{ name: "Args", arguments: [] }],
            },
          ],
          statements: [
            `return ctx.prisma.${collectionName}.${fieldInfo.name}(args);`,
          ],
        };
      }),
  });

  await saveSourceFile(sourceFile);

  return fieldArgsTypeNames;
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
