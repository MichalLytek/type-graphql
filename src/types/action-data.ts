import { GraphQLResolveInfo } from "graphql";

export interface ArgsDictionary {
  [argName: string]: any;
}

export interface ResolverData<ContextType = {}> {
  root: any;
  args: ArgsDictionary;
  context: ContextType;
  info: GraphQLResolveInfo;
}
