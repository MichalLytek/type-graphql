import { GraphQLSchema } from "graphql";

import { SchemaGenerator, SchemaGeneratorOptions } from "../schema/schema-generator";
import { loadResolversFromGlob } from "../helpers/loadResolversFromGlob";
import {
  defaultSchemaFilePath,
  emitSchemaDefinitionFileSync,
  emitSchemaDefinitionFile,
} from "./emitSchemaDefinitionFile";

export interface BuildSchemaOptions extends SchemaGeneratorOptions {
  /** Array of resolvers classes or glob paths to resolver files */
  resolvers: Array<Function | string>;
  /** Path to the file to where emit the schema or `true` for the default `./schema.gql` one */
  emitSchemaFile?: string | boolean;
}
export async function buildSchema(options: BuildSchemaOptions): Promise<GraphQLSchema> {
  loadResolvers(options);
  const schema = await SchemaGenerator.generateFromMetadata(options);
  if (options.emitSchemaFile) {
    const schemaFileName = getSchemaDefinitionFileName(options);
    await emitSchemaDefinitionFile(schemaFileName, schema);
  }
  return schema;
}

export function buildSchemaSync(options: BuildSchemaOptions): GraphQLSchema {
  loadResolvers(options);
  const schema = SchemaGenerator.generateFromMetadataSync(options);
  if (options.emitSchemaFile) {
    const schemaFileName = getSchemaDefinitionFileName(options);
    emitSchemaDefinitionFileSync(schemaFileName, schema);
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

function getSchemaDefinitionFileName(options: BuildSchemaOptions): string {
  return typeof options.emitSchemaFile === "string"
    ? options.emitSchemaFile
    : defaultSchemaFilePath;
}
