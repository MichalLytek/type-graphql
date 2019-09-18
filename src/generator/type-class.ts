import {
  SourceFile,
  PropertyDeclarationStructure,
  OptionalKind,
} from "ts-morph";
import { DMMF } from "@prisma/photon/dist/runtime/dmmf-types";
import { getFieldTSType, getTypeGraphQLType } from "./helpers";
import { DMMFTypeInfo } from "./types";

export default async function generateOutputTypeClassFromType(
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
