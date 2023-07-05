import type { GraphQLResolveInfo } from "graphql";

export interface ArgsDictionary {
  [argName: string]: any;
}

export interface ResolverData<TContextType extends object = object> {
  root: any;
  args: ArgsDictionary;
  context: TContextType;
  info: GraphQLResolveInfo;
}
