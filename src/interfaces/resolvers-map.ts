import { GraphQLFieldResolver, GraphQLIsTypeOfFn, GraphQLScalarType, GraphQLTypeResolver } from 'graphql'

export interface ResolversMap<TSource = any, TContext = any> {
  [key: string]:
    | ResolverObject<TSource, TContext>
    | ResolverOptions<TSource, TContext>
    | GraphQLScalarType
    | EnumResolver
}

export interface ResolverObject<TSource = any, TContext = any> {
  [key: string]: ResolverOptions<TSource, TContext> | GraphQLFieldResolver<TSource, TContext>
}

export interface EnumResolver {
  [key: string]: string | number
}

export interface ResolverOptions<TSource = any, TContext = any> {
  fragment?: string
  resolve?: GraphQLFieldResolver<TSource, TContext>
  subscribe?: GraphQLFieldResolver<TSource, TContext>
  __resolveType?: GraphQLTypeResolver<TSource, TContext>
  __isTypeOf?: GraphQLIsTypeOfFn<TSource, TContext>
}
