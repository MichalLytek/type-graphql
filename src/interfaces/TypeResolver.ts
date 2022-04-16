import { GraphQLTypeResolver } from 'graphql'

import { ClassType } from './ClassType'
import { Maybe, MaybePromise } from './Maybe'

export type TypeResolver<TSource, TContext> = (
  ...args: Parameters<GraphQLTypeResolver<TSource, TContext>>
) => MaybePromise<Maybe<string | ClassType>>
