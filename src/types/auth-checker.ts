import { ActionData } from "./action-data";

export type AuthChecker<ContextType = {}> = (
  actionData: ActionData<ContextType>,
  roles: string[],
) => boolean | Promise<boolean>;
