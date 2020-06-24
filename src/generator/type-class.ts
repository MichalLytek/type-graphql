import {
  PropertyDeclarationStructure,
  OptionalKind,
  Project,
  MethodDeclarationStructure,
  GetAccessorDeclarationStructure,
  SetAccessorDeclarationStructure,
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
  generatePrismaJsonTypeImport,
} from "./imports";
import saveSourceFile from "../utils/saveSourceFile";
import generateArgsTypeClassFromArgs from "./args-class";
import { DmmfDocument } from "./dmmf/dmmf-document";
import { DMMF } from "./dmmf/types";
import { GenerateCodeOptions } from "./options";

export async function generateOutputTypeClassFromType(
  project: Project,
  dirPath: string,
  type: DMMF.OutputType,
  dmmfDocument: DmmfDocument,
  options: GenerateCodeOptions,
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
  generatePrismaJsonTypeImport(
    sourceFile,
    options.relativePrismaRequirePath,
    2,
  );
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
          type: getFieldTSType(field.outputType, dmmfDocument, false),
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
          type: getFieldTSType(fieldInfo.outputType, dmmfDocument, false),
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
  options: GenerateCodeOptions,
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
  generatePrismaJsonTypeImport(
    sourceFile,
    options.relativePrismaRequirePath,
    2,
  );
  generateInputsImports(
    sourceFile,
    inputType.fields
      .filter(field => field.selectedInputType.kind === "object")
      .map(field => field.selectedInputType.type)
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

  const fields = inputType.fields.map(field => {
    const hasMappedName = field.name !== field.typeName;
    return {
      ...field,
      hasMappedName,
    };
  });

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
    properties: fields.map<OptionalKind<PropertyDeclarationStructure>>(
      field => {
        const isOptional = !field.selectedInputType.isRequired;
        return {
          name: field.name,
          type: getFieldTSType(field.selectedInputType, dmmfDocument, true),
          hasExclamationToken: !isOptional,
          hasQuestionToken: isOptional,
          trailingTrivia: "\r\n",
          decorators: field.hasMappedName
            ? []
            : [
                {
                  name: "TypeGraphQL.Field",
                  arguments: [
                    `_type => ${getTypeGraphQLType(
                      field.selectedInputType,
                      dmmfDocument,
                    )}`,
                    `{
                  nullable: ${isOptional},
                  description: undefined
                }`,
                  ],
                },
              ],
        };
      },
    ),
    getAccessors: fields
      .filter(field => field.hasMappedName)
      .map<OptionalKind<GetAccessorDeclarationStructure>>(field => {
        return {
          name: field.typeName,
          type: getFieldTSType(field.selectedInputType, dmmfDocument, true),
          hasExclamationToken: field.selectedInputType.isRequired,
          hasQuestionToken: !field.selectedInputType.isRequired,
          trailingTrivia: "\r\n",
          statements: [`return this.${field.name};`],
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
    setAccessors: fields
      .filter(field => field.hasMappedName)
      .map<OptionalKind<SetAccessorDeclarationStructure>>(field => {
        const fieldTSType = getFieldTSType(
          field.selectedInputType,
          dmmfDocument,
          true,
        );
        return {
          name: field.typeName,
          type: fieldTSType,
          hasExclamationToken: field.selectedInputType.isRequired,
          hasQuestionToken: !field.selectedInputType.isRequired,
          trailingTrivia: "\r\n",
          parameters: [{ name: field.name, type: fieldTSType }],
          statements: [`this.${field.name} = ${field.name};`],
        };
      }),
  });

  await saveSourceFile(sourceFile);
}
