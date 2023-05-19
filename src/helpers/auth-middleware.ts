import { MiddlewareFn } from "../interfaces/Middleware";
import { AuthChecker, AuthCheckerFn, AuthMode } from "../interfaces";
import { AuthenticationError, AuthorizationError } from "../errors";
import { IOCContainer } from "../utils/container";

export function AuthMiddleware(
  authChecker: AuthChecker<any, any>,
  container: IOCContainer,
  authMode: AuthMode,
  roles: any[],
): MiddlewareFn {
  return async (action, next) => {
    let accessGranted: boolean;
    if (authChecker.prototype) {
      const authCheckerInstance = await container.getInstance(authChecker, action);
      accessGranted = await authCheckerInstance.check(action, roles);
    } else {
      accessGranted = await (authChecker as AuthCheckerFn<any, any>)(action, roles);
    }

    if (!accessGranted) {
      if (authMode === "null") {
        return null;
      } else if (authMode === "error") {
        throw roles.length === 0 ? new AuthenticationError() : new AuthorizationError();
      }
    }
    return next();
  };
}
