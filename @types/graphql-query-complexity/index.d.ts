declare module "graphql-query-complexity" {
  import { ValidationContext } from "graphql";
  import QueryComplexity, {
    QueryComplexityOptions,
  } from "graphql-query-complexity/dist/QueryComplexity";

  export type ComplexityResolver = (args: any, complexity: number) => number;

  export type Complexity = number | ComplexityResolver;

  export default function createQueryComplexityValidator(
    options: QueryComplexityOptions,
  ): (context: ValidationContext) => QueryComplexity;
}

declare module "graphql-query-complexity/dist/QueryComplexity" {
  import {
    ValidationContext,
    FragmentDefinitionNode,
    OperationDefinitionNode,
    FieldNode,
    InlineFragmentNode,
    GraphQLUnionType,
    GraphQLObjectType,
    GraphQLInterfaceType,
    GraphQLError,
  } from "graphql";

  export interface QueryComplexityOptions {
    maximumComplexity: number;
    variables?: Object;
    onComplete?: (complexity: number) => void;
    createError?: (max: number, actual: number) => GraphQLError;
  }

  export default class QueryComplexity {
    context: ValidationContext;
    complexity: number;
    options: QueryComplexityOptions;
    fragments: {
      [name: string]: FragmentDefinitionNode;
    };
    OperationDefinition: Object;
    constructor(context: ValidationContext, options: QueryComplexityOptions);
    onOperationDefinitionEnter(operation: OperationDefinitionNode): void;
    onOperationDefinitionLeave(): GraphQLError | undefined;
    nodeComplexity(
      node: FieldNode | FragmentDefinitionNode | InlineFragmentNode | OperationDefinitionNode,
      typeDef: GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType,
      complexity?: number,
    ): number;
    createError(): GraphQLError;
    getDefaultComplexity(args: Object, childScore: number): number;
  }
}
