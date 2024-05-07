import { type GraphQLResolveInfo } from "graphql";
import { type ArgsDictionary } from "./resolver-data";

export interface SubscribeResolverData<TSource = any, TArgs = ArgsDictionary, TContext = {}> {
  source: TSource;
  args: TArgs;
  context: TContext;
  info: GraphQLResolveInfo;
}
