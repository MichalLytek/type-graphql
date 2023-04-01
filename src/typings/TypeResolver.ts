import type { GraphQLTypeResolver } from "graphql";
import type { ClassType } from "./ClassType";
import type { Maybe, MaybePromise } from "./Maybe";

export type TypeResolver<TSource, TContext> = (
  ...args: Parameters<GraphQLTypeResolver<TSource, TContext>>
) => MaybePromise<Maybe<string | ClassType>>;
