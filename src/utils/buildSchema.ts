import { GraphQLSchema } from "graphql";

import { SchemaGenerator } from "../schema/schema-generator";

export interface BuildSchemaOptions {
  resolvers: Function[];
}

export function buildSchema(options: BuildSchemaOptions): GraphQLSchema {
  return SchemaGenerator.generateFromMetadata();
}
