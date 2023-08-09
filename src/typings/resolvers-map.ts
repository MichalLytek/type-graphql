import {
  type GraphQLFieldResolver,
  type GraphQLIsTypeOfFn,
  type GraphQLScalarType,
  type GraphQLTypeResolver,
} from "graphql";

export type ResolversMap<TSource = any, TContext = any> = Record<
  string,
  | ResolverObject<TSource, TContext>
  | ResolverOptions<TSource, TContext>
  | GraphQLScalarType
  | EnumResolver
>;

export type ResolverObject<TSource = any, TContext = any> = Record<
  string,
  ResolverOptions<TSource, TContext> | GraphQLFieldResolver<TSource, TContext>
>;

export type EnumResolver = Record<string, string | number>;

export interface ResolverOptions<TSource = any, TContext = any> {
  fragment?: string;
  resolve?: GraphQLFieldResolver<TSource, TContext>;
  subscribe?: GraphQLFieldResolver<TSource, TContext>;
  __resolveType?: GraphQLTypeResolver<TSource, TContext>;
  __isTypeOf?: GraphQLIsTypeOfFn<TSource, TContext>;
}
