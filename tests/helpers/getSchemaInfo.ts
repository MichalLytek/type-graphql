import {
  graphql,
  getIntrospectionQuery,
  IntrospectionObjectType,
  IntrospectionSchema,
  ExecutionResult,
} from "graphql";

import { buildSchema, BuildSchemaOptions } from "../../src";

export async function getSchemaInfo(options: BuildSchemaOptions) {
  // build schema from definitions
  const schema = await buildSchema({
    ...options,
    validate: false,
    skipCheck: true,
  });

  // get builded schema info from retrospection
  const result: ExecutionResult<any> = await graphql({ schema, source: getIntrospectionQuery() });

  expect(result.errors).toBeUndefined();

  const schemaIntrospection = result.data!.__schema as IntrospectionSchema;
  expect(schemaIntrospection).toBeDefined();

  const queryType = schemaIntrospection.types.find(
    type => type.name === schemaIntrospection.queryType.name,
  ) as IntrospectionObjectType;

  const mutationTypeNameRef = schemaIntrospection.mutationType;
  let mutationType: IntrospectionObjectType | undefined;
  if (mutationTypeNameRef) {
    mutationType = schemaIntrospection.types.find(
      type => type.name === mutationTypeNameRef.name,
    ) as IntrospectionObjectType;
  }

  const subscriptionTypeNameRef = schemaIntrospection.subscriptionType;
  let subscriptionType: IntrospectionObjectType | undefined;
  if (subscriptionTypeNameRef) {
    subscriptionType = schemaIntrospection.types.find(
      type => type.name === subscriptionTypeNameRef.name,
    ) as IntrospectionObjectType;
  }

  return {
    schema,
    schemaIntrospection,
    queryType,
    mutationType,
    subscriptionType,
  };
}
