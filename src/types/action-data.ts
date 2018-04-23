import { GraphQLResolveInfo } from "graphql";

export interface ArgsDictionary {
  [argName: string]: any;
}

export interface ActionData<ContextType = {}> {
  root: any;
  args: ArgsDictionary;
  context: ContextType;
  info: GraphQLResolveInfo;
}
