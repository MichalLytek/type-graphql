import { GraphQLSchema, printSchema } from "graphql";
import { Options as PrintSchemaOptions } from "graphql/utilities/schemaPrinter";
import { outputFile, outputFileSync } from "fs-extra";

export const defaultPrintSchemaOptions: PrintSchemaOptions = { commentDescriptions: false };

const generatedSchemaWarning = /* graphql */ `\
# -----------------------------------------------
# !!! THIS FILE WAS GENERATED BY TYPE-GRAPHQL !!!
# !!!   DO NOT MODIFY THIS FILE BY YOURSELF   !!!
# -----------------------------------------------

`;

export function emitSchemaDefinitionFileSync(
  schemaFilePath: string,
  schema: GraphQLSchema,
  options: PrintSchemaOptions = defaultPrintSchemaOptions,
) {
  const schemaFileContent = generatedSchemaWarning + printSchema(schema, options);
  outputFileSync(schemaFilePath, schemaFileContent);
}

export async function emitSchemaDefinitionFile(
  schemaFilePath: string,
  schema: GraphQLSchema,
  options: PrintSchemaOptions = defaultPrintSchemaOptions,
) {
  const schemaFileContent = generatedSchemaWarning + printSchema(schema, options);
  return outputFile(schemaFilePath, schemaFileContent);
}
