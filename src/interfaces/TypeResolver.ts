import { GraphQLResolveInfo } from "graphql";
import { MaybePromise } from "graphql/jsutils/MaybePromise";
import Maybe from "graphql/tsutils/Maybe";

import { ClassType } from "./ClassType";

export type TypeResolver<TSource, TContext> = (
  value: TSource,
  context: TContext,
  info: GraphQLResolveInfo,
) => MaybePromise<Maybe<string | ClassType>>;
