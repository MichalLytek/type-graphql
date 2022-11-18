import { GraphQLSchema, printSchema, lexicographicSortSchema, buildClientSchema } from "graphql";

import { outputFile, outputFileSync } from "../helpers/filesystem";

export interface PrintSchemaOptions {
  sortedSchema: boolean;
}

export const defaultPrintSchemaOptions: PrintSchemaOptions = {
  sortedSchema: true,
};

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
  const schemaFileContent = getSchemaFileContent(schema, options);
  outputFileSync(schemaFilePath, schemaFileContent);
}

export async function emitSchemaDefinitionFile(
  schemaFilePath: string,
  schema: GraphQLSchema,
  options: PrintSchemaOptions = defaultPrintSchemaOptions,
) {
  const schemaFileContent = getSchemaFileContent(schema, options);
  await outputFile(schemaFilePath, schemaFileContent);
}

function getSchemaFileContent(schema: GraphQLSchema, options: PrintSchemaOptions) {
  const schemaToEmit = options.sortedSchema ? lexicographicSortSchema(schema) : schema;
  return generatedSchemaWarning + printSchema(schemaToEmit);
}
