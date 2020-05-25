import {
  PropertyDeclarationStructure,
  OptionalKind,
  Project,
  MethodDeclarationStructure,
} from "ts-morph";
import path from "path";

import {
  getFieldTSType,
  getTypeGraphQLType,
  camelCase,
  pascalCase,
} from "./helpers";
import { outputsFolderName, inputsFolderName } from "./config";
import {
  generateTypeGraphQLImport,
  generateInputsImports,
  generateEnumsImports,
  generateArgsImports,
  generateGraphQLScalarImport,
} from "./imports";
import saveSourceFile from "../utils/saveSourceFile";
import generateArgsTypeClassFromArgs from "./args-class";
import { DmmfDocument } from "./dmmf/dmmf-document";
import { DMMF } from "./dmmf/types";

export async function generateOutputTypeClassFromType(
  project: Project,
  dirPath: string,
  type: DMMF.OutputType,
  dmmfDocument: DmmfDocument,
) {
  // TODO: make it more future-proof
  const modelName = type.name.replace("Aggregate", "");
  const typeName = !type.name.includes("Aggregate")
    ? type.name
    : `Aggregate${dmmfDocument.getModelTypeName(
        type.name.replace("Aggregate", ""),
      )}`;

  const fileDirPath = path.resolve(dirPath, outputsFolderName);
  const filePath = path.resolve(fileDirPath, `${typeName}.ts`);
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
          `${typeName}${pascalCase(field.name)}`,
          dmmfDocument,
          2,
        );
      }
      return { ...field, argsTypeName };
    }),
  );

  const fieldArgsTypeNames = fieldsInfo
    .filter(it => it.argsTypeName)
    .map(it => it.argsTypeName!);

  generateTypeGraphQLImport(sourceFile);
  generateGraphQLScalarImport(sourceFile);
  generateArgsImports(sourceFile, fieldArgsTypeNames, 0);

  sourceFile.addClass({
    name: typeName,
    isExported: true,
    decorators: [
      {
        name: "TypeGraphQL.ObjectType",
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
          type: getFieldTSType(field.outputType, dmmfDocument),
          hasExclamationToken: isRequired,
          hasQuestionToken: !isRequired,
          trailingTrivia: "\r\n",
          decorators: [
            {
              name: "TypeGraphQL.Field",
              arguments: [
                `_type => ${getTypeGraphQLType(
                  field.outputType,
                  dmmfDocument,
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
        const collectionName = camelCase(modelName);

        return {
          name: fieldInfo.name,
          type: getFieldTSType(fieldInfo.outputType, dmmfDocument),
          trailingTrivia: "\r\n",
          decorators: [
            {
              name: "TypeGraphQL.Field",
              arguments: [
                `_type => ${getTypeGraphQLType(
                  fieldInfo.outputType,
                  dmmfDocument,
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
              decorators: [{ name: "TypeGraphQL.Ctx", arguments: [] }],
            },
            {
              name: "args",
              type: fieldInfo.argsTypeName,
              decorators: [{ name: "TypeGraphQL.Args", arguments: [] }],
            },
          ],
          statements: [
            `return ctx.prisma.${collectionName}.${fieldInfo.name}(args);`,
          ],
        };
      }),
  });

  await saveSourceFile(sourceFile);

  return { typeName, fieldArgsTypeNames };
}

export async function generateInputTypeClassFromType(
  project: Project,
  dirPath: string,
  inputType: DMMF.InputType,
  dmmfDocument: DmmfDocument,
): Promise<void> {
  const filePath = path.resolve(
    dirPath,
    inputsFolderName,
    `${inputType.typeName}.ts`,
  );
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  generateTypeGraphQLImport(sourceFile);
  generateGraphQLScalarImport(sourceFile);
  generateInputsImports(
    sourceFile,
    inputType.fields
      .map(field => field.selectedInputType)
      .filter(
        fieldInputType =>
          fieldInputType.kind === "object" &&
          fieldInputType.type !== "JsonFilter",
      )
      .map(fieldInputType => fieldInputType.type)
      .filter(fieldType => fieldType !== inputType.typeName),
  );
  generateEnumsImports(
    sourceFile,
    inputType.fields
      .map(field => field.selectedInputType)
      .filter(fieldType => fieldType.kind === "enum")
      .map(fieldType => fieldType.type as string),
    2,
  );

  sourceFile.addClass({
    name: inputType.typeName,
    isExported: true,
    decorators: [
      {
        name: "TypeGraphQL.InputType",
        arguments: [
          `{
            isAbstract: true,
            description: undefined,
          }`,
        ],
      },
    ],
    properties: inputType.fields
      .filter(field => field.selectedInputType.type !== "JsonFilter")
      .map<OptionalKind<PropertyDeclarationStructure>>(field => {
        return {
          name: field.name,
          type: getFieldTSType(field.selectedInputType, dmmfDocument),
          hasExclamationToken: field.selectedInputType.isRequired,
          hasQuestionToken: !field.selectedInputType.isRequired,
          trailingTrivia: "\r\n",
          decorators: [
            {
              name: "TypeGraphQL.Field",
              arguments: [
                `_type => ${getTypeGraphQLType(
                  field.selectedInputType,
                  dmmfDocument,
                )}`,
                `{
                  nullable: ${!field.selectedInputType.isRequired},
                  description: undefined
                }`,
              ],
            },
          ],
        };
      }),
  });

  await saveSourceFile(sourceFile);
}
