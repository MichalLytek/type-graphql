import { GraphQLFieldConfig, GraphQLError } from "graphql";

export type ComplexityResolver = (args: any, complexity: number) => number;

type ComplexityGraphQLFieldConfig<TSource, TContext> = GraphQLFieldConfig<TSource, TContext> & {
  complexity?: ComplexityResolver | number;
};

export interface ComplexityGraphQLFieldConfigMap<TSource, TContext> {
  [key: string]: ComplexityGraphQLFieldConfig<TSource, TContext>;
}
