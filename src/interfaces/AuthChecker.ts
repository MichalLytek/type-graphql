import { ClassType } from './ClassType'
import { ResolverData } from './ResolverData'

export type AuthCheckerFn<TContextType = {}, TRoleType = string> = (
  resolverData: ResolverData<TContextType>,
  roles: TRoleType[]
) => boolean | Promise<boolean>

export interface AuthCheckerInterface<TContextType = {}, TRoleType = string> {
  check: (resolverData: ResolverData<TContextType>, roles: TRoleType[]) => boolean | Promise<boolean>
}

export type AuthChecker<TContextType = {}, TRoleType = string> =
  | AuthCheckerFn<TContextType, TRoleType>
  | ClassType<AuthCheckerInterface<TContextType, TRoleType>>

export type AuthMode = 'error' | 'null'
