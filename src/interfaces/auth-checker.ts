import { ResolverData } from "../types/action-data";

export type AuthChecker<ContextType = {}> = (
  resolverData: ResolverData<ContextType>,
  roles: string[],
) => boolean | Promise<boolean>;

export type AuthMode = "error" | "null";
