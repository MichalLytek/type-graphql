import { GraphQLSchema } from "graphql";

import { SchemaGenerator, SchemaGeneratorOptions } from "../schema/schema-generator";
import { loadResolversFromGlob } from "../helpers/loadResolversFromGlob";

export interface BuildSchemaOptions extends SchemaGeneratorOptions {
  resolvers: Array<Function | string>;
}
export function buildSchema(options: BuildSchemaOptions): Promise<GraphQLSchema> {
  loadResolvers(options);
  return SchemaGenerator.generateFromMetadata(options);
}

export function buildSchemaSync(options: BuildSchemaOptions): GraphQLSchema {
  loadResolvers(options);
  return SchemaGenerator.generateFromMetadataSync(options);
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
