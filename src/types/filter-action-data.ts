import { GraphQLResolveInfo } from "graphql";

export interface ArgsDictionary {
  [argName: string]: any;
}

export interface FilterActionData<
  TPayload = any,
  TArgs = ArgsDictionary,
  TContext = {}
> {
  payload: TPayload;
  args: TArgs;
  context: TContext;
  info: GraphQLResolveInfo;
}
