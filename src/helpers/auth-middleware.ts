import { MiddlewareFn } from "../interfaces/Middleware";
import { AuthChecker, AuthMode } from "../interfaces/auth-checker";
import { UnauthorizedError, ForbiddenError } from "../errors";

export function AuthMiddleware(
  authChecker: AuthChecker,
  authMode: AuthMode,
  roles: string[],
): MiddlewareFn {
  return async (action, next) => {
    const accessGranted = await authChecker(action, roles);
    if (!accessGranted) {
      if (authMode === "null") {
        return null;
      } else if (authMode === "error") {
        throw roles.length === 0 ? new UnauthorizedError() : new ForbiddenError();
      }
    }
    return next();
  };
}
