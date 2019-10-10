import {
  SourceFile,
  PropertyDeclarationStructure,
  OptionalKind,
} from "ts-morph";
import { DMMF } from "@prisma/photon";

import {
  getFieldTSType,
  getTypeGraphQLType,
  pascalCase,
  selectInputTypeFromTypes,
} from "./helpers";
import { DMMFTypeInfo } from "./types";

export default function generateArgsTypeClassFromArgs(
  sourceFile: SourceFile,
  args: DMMF.SchemaArg[],
  methodName: string,
  modelNames: string[],
) {
  const name = `${pascalCase(methodName)}Args`;
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
  return name;
}
