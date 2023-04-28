/* eslint "no-underscore-dangle": ["error", { "allow": ["__schema"] }] */
import type { IntrospectionObjectType, IntrospectionSchema } from "graphql";
import { getIntrospectionQuery, graphql } from "graphql";
import type { BuildSchemaOptions } from "type-graphql";
import { buildSchema } from "type-graphql";

export async function getSchemaInfo(options: BuildSchemaOptions) {
  // Build schema from definitions
  const schema = await buildSchema({
    ...options,
    validate: false,
    skipCheck: true,
  });

  // Get built schema info from retrospection
  const result = await graphql({
    schema,
    source: getIntrospectionQuery({
      inputValueDeprecation: true,
    }),
  });
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
