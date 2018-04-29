import { GraphQLResolveInfo } from "graphql";

import { ArgsDictionary } from "./action-data";

export interface ResolverFilterData<TPayload = any, TArgs = ArgsDictionary, TContext = {}> {
  payload: TPayload;
  args: TArgs;
  context: TContext;
  info: GraphQLResolveInfo;
}
