import { graphql, introspectionQuery, IntrospectionObjectType, IntrospectionSchema } from "graphql";
import { buildSchema, BuildSchemaOptions } from "../../src";

export async function getSchemaInfo(options: BuildSchemaOptions) {
  // build schema from definitions
  const schema = buildSchema(options);

  // get builded schema info from retrospection
  const result = await graphql(schema, introspectionQuery);

  const schemaIntrospection = result.data!.__schema as IntrospectionSchema;
  expect(schemaIntrospection).toBeDefined();

  const queryType = schemaIntrospection.types.find(
    type => type.name === schemaIntrospection.queryType.name,
  ) as IntrospectionObjectType;

  const mutationType = schemaIntrospection.types.find(
    type => type.name === schemaIntrospection.mutationType!.name,
  ) as IntrospectionObjectType;

  return {
    schemaIntrospection,
    queryType,
    mutationType,
  };
}
