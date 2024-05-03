import { type GraphQLTypeResolver } from "graphql";
import { type ClassType, type Maybe, type MaybePromise } from "./utils";

export type TypeResolver<TSource, TContext> = (
  ...args: Parameters<GraphQLTypeResolver<TSource, TContext>>
) => MaybePromise<Maybe<string | ClassType>>;
