import type { GraphQLTypeResolver } from "graphql";
import type { Class, Maybe, MaybePromise } from "./utils";

export type TypeResolver<TSource, TContext> = (
  ...args: Parameters<GraphQLTypeResolver<TSource, TContext>>
) => MaybePromise<Maybe<string | Class>>;
