import type { ResolverData } from "./ResolverData";
import type { ClassType } from "./utils";

export type AuthCheckerFn<TContextType = {}, TRoleType = string> = (
  resolverData: ResolverData<TContextType>,
  roles: TRoleType[],
) => boolean | Promise<boolean>;

export type AuthCheckerInterface<TContextType = {}, TRoleType = string> = {
  check(resolverData: ResolverData<TContextType>, roles: TRoleType[]): boolean | Promise<boolean>;
};

export type AuthChecker<TContextType = {}, TRoleType = string> =
  | AuthCheckerFn<TContextType, TRoleType>
  | ClassType<AuthCheckerInterface<TContextType, TRoleType>>;

export type AuthMode = "error" | "null";
