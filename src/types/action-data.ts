import { GraphQLResolveInfo } from "graphql";

export interface ActionData<ContextType = {}> {
  root: any;
  args: { [argName: string]: any };
  context: ContextType;
  info: GraphQLResolveInfo;
}
