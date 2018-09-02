import { Complexity } from "graphql-query-complexity";

declare module "graphql/type/definition" {
  export interface GraphQLFieldConfig<TSource, TContext, TArgs = { [argName: string]: any }> {
    complexity?: Complexity;
  }
}
