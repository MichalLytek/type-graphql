import { GraphQLSchema } from "graphql";

import { SchemaGenerator, SchemaGeneratorOptions } from "../schema/schema-generator";
import { loadResolversFromGlob } from "../helpers/loadResolversFromGlob";

export interface BuildSchemaOptions extends SchemaGeneratorOptions {
  resolvers: Array<Function | string>;
}
export async function buildSchema(options: BuildSchemaOptions): Promise<GraphQLSchema> {
  if (options.resolvers.length === 0) {
    throw new Error("Empty `resolvers` array property found in `buildSchema` options!");
  }
  await Promise.all(
    options.resolvers.map(async resolver => {
      if (typeof resolver === "string") {
        await loadResolversFromGlob(resolver);
      }
    }),
  );

  return SchemaGenerator.generateFromMetadata(options);
}
