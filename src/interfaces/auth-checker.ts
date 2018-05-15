import { ResolverData } from "../types/action-data";

export type AuthChecker<ContextType = {}> = (
  resolverData: ResolverData<ContextType>,
  roles: any[],
) => boolean | Promise<boolean>;

export type AuthMode = "error" | "null";
