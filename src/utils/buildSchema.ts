import { GraphQLSchema } from "graphql";
import { Options as PrintSchemaOptions } from "graphql/utilities/schemaPrinter";

import { SchemaGenerator, SchemaGeneratorOptions } from "../schema/schema-generator";
import { loadResolversFromGlob } from "../helpers/loadResolversFromGlob";
import {
  defaultSchemaFilePath,
  emitSchemaDefinitionFileSync,
  emitSchemaDefinitionFile,
  defaultPrintSchemaOptions,
} from "./emitSchemaDefinitionFile";

interface EmitSchemaFileOptions extends PrintSchemaOptions {
  path?: string;
}

export interface BuildSchemaOptions extends SchemaGeneratorOptions {
  /** Array of resolvers classes or glob paths to resolver files */
  resolvers: Array<Function | string>;
  /**
   * Path to the file to where emit the schema
   * or config object with print schema options
   * or `true` for the default `./schema.gql` one
   */
  emitSchemaFile?: string | boolean | EmitSchemaFileOptions;
}
export async function buildSchema(options: BuildSchemaOptions): Promise<GraphQLSchema> {
  loadResolvers(options);
  const schema = await SchemaGenerator.generateFromMetadata(options);
  if (options.emitSchemaFile) {
    const { schemaFileName, printSchemaOptions } = getEmitSchemaDefinitionFileOptions(options);
    await emitSchemaDefinitionFile(schemaFileName, schema, printSchemaOptions);
  }
  return schema;
}

export function buildSchemaSync(options: BuildSchemaOptions): GraphQLSchema {
  loadResolvers(options);
  const schema = SchemaGenerator.generateFromMetadataSync(options);
  if (options.emitSchemaFile) {
    const { schemaFileName, printSchemaOptions } = getEmitSchemaDefinitionFileOptions(options);
    emitSchemaDefinitionFileSync(schemaFileName, schema, printSchemaOptions);
  }
  return schema;
}

function loadResolvers(options: BuildSchemaOptions) {
  if (options.resolvers.length === 0) {
    throw new Error("Empty `resolvers` array property found in `buildSchema` options!");
  }
  options.resolvers.forEach(resolver => {
    if (typeof resolver === "string") {
      loadResolversFromGlob(resolver);
    }
  });
}

function getEmitSchemaDefinitionFileOptions(
  buildSchemaOptions: BuildSchemaOptions,
): {
  schemaFileName: string;
  printSchemaOptions: PrintSchemaOptions;
} {
  return {
    schemaFileName:
      typeof buildSchemaOptions.emitSchemaFile === "string"
        ? buildSchemaOptions.emitSchemaFile
        : typeof buildSchemaOptions.emitSchemaFile === "object"
        ? buildSchemaOptions.emitSchemaFile.path || defaultSchemaFilePath
        : defaultSchemaFilePath,
    printSchemaOptions:
      typeof buildSchemaOptions.emitSchemaFile === "object"
        ? buildSchemaOptions.emitSchemaFile
        : defaultPrintSchemaOptions,
  };
}
