import { ResolverData } from "../types/action-data";

export type AuthChecker<ContextType = {}, RoleType = string> = (
  resolverData: ResolverData<ContextType>,
  roles: RoleType[],
) => boolean | Promise<boolean>;

export type AuthMode = "error" | "null";
