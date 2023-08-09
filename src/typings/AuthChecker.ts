import { type ResolverData } from "./ResolverData";
import { type ClassType } from "./utils";

export type AuthCheckerFn<TContextType extends object = object, TRoleType = string> = (
  resolverData: ResolverData<TContextType>,
  roles: TRoleType[],
) => boolean | Promise<boolean>;

export interface AuthCheckerInterface<TContextType extends object = object, TRoleType = string> {
  check(resolverData: ResolverData<TContextType>, roles: TRoleType[]): boolean | Promise<boolean>;
}

export type AuthChecker<TContextType extends object = object, TRoleType = string> =
  | AuthCheckerFn<TContextType, TRoleType>
  | ClassType<AuthCheckerInterface<TContextType, TRoleType>>;

export type AuthMode = "error" | "null";
