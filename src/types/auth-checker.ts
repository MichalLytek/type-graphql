import { GraphQLResolveInfo } from "graphql";

export interface ActionData {
  root: any;
  args: any;
  context: any;
  info: GraphQLResolveInfo;
}
export type AuthCheckerFunc = (
  actionData: ActionData,
  roles: string[],
) => boolean | Promise<boolean>;
