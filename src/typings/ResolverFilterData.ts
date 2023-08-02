import { type GraphQLResolveInfo } from "graphql";
import { type ArgsDictionary } from "./ResolverData";

export interface ResolverFilterData<TPayload = any, TArgs = ArgsDictionary, TContext = {}> {
  payload: TPayload;
  args: TArgs;
  context: TContext;
  info: GraphQLResolveInfo;
}
