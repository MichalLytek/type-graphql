import { ForbiddenError, UnauthorizedError } from "@/errors";
import { AuthChecker, AuthCheckerFn, AuthMode } from "@/interfaces";
import { MiddlewareFn } from "@/interfaces/Middleware";
import { IOCContainer } from "@/utils/container";

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
      }
      if (authMode === "error") {
        throw roles.length === 0 ? new UnauthorizedError() : new ForbiddenError();
      }
    }
    return next();
  };
}
