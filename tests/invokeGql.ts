import { graphql, GraphQLFieldResolver, GraphQLSchema, GraphQLTypeResolver, Source } from "graphql";
import { Maybe } from "../src";

/** just a tiny helper to make transition from v15 to v16 less painful, feel free to remove if those 200 usages that existed at the time of writing this in tests are refactored */
export const invokeGql = (
  schema: GraphQLSchema,
  source: string | Source,
  rootValue?: unknown,
  contextValue?: unknown,
  variableValues?: Maybe<{
    readonly [variable: string]: unknown;
  }>,
  operationName?: Maybe<string>,
  fieldResolver?: Maybe<GraphQLFieldResolver<any, any>>,
  typeResolver?: Maybe<GraphQLTypeResolver<any, any>>,
) => {
  return graphql({
    schema,
    source,
    rootValue,
    contextValue,
    variableValues,
    operationName,
    fieldResolver,
    typeResolver,
  }) as any;
};
