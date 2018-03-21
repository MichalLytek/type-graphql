import { GraphQLResolveInfo } from "graphql";

export interface ActionData<ContextType = {}> {
  root: any;
  args: { [argName: string]: any };
  context: ContextType;
  info: GraphQLResolveInfo;
}

export type AuthChecker<ContextType = {}> = (
  actionData: ActionData<ContextType>,
  roles: string[],
) => boolean | Promise<boolean>;
