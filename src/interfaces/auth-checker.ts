import { ActionData } from "../types/action-data";

export type AuthChecker<ContextType = {}> = (
  actionData: ActionData<ContextType>,
  roles: string[],
) => boolean | Promise<boolean>;

export type AuthMode = "error" | "null";
