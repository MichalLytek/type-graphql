import { AuthenticationError, AuthorizationError } from "@/errors";
import { type AuthChecker, type AuthCheckerFn, type AuthMode } from "@/typings";
import { type MiddlewareFn } from "@/typings/middleware";
import { type IOCContainer } from "@/utils/container";
import { isPromiseLike } from "@/utils/isPromiseLike";

export function AuthMiddleware(
  authChecker: AuthChecker<any, any>,
  container: IOCContainer,
  authMode: AuthMode,
  roles: any[],
): MiddlewareFn {
  // Stay synchronous when the auth check resolves synchronously (the common
  // case of a sync `authChecker`). The original middleware was always `async`,
  // so `await authChecker()` scheduled a microtask and allocated a promise for
  // every `@Authorized` field — a large cost on queries that resolve many
  // authorized fields. We only fall back to async when the checker (or the
  // container instance) is actually promise-like.
  return (action, next) => {
    const handleAccess = (accessGranted: boolean) => {
      if (!accessGranted) {
        if (authMode === "null") {
          return null;
        }
        if (authMode === "error") {
          throw roles.length === 0 ? new AuthenticationError() : new AuthorizationError();
        }
      }
      return next();
    };

    if (authChecker.prototype) {
      const runCheck = (authCheckerInstance: { check: AuthCheckerFn<any, any> }) => {
        const accessGranted = authCheckerInstance.check(action, roles);
        return isPromiseLike(accessGranted)
          ? accessGranted.then(handleAccess)
          : handleAccess(accessGranted);
      };
      const instanceOrPromise = container.getInstance(authChecker, action);
      return isPromiseLike(instanceOrPromise)
        ? instanceOrPromise.then(runCheck)
        : runCheck(instanceOrPromise);
    }

    const accessGranted = (authChecker as AuthCheckerFn<any, any>)(action, roles);
    return isPromiseLike(accessGranted)
      ? accessGranted.then(handleAccess)
      : handleAccess(accessGranted);
  };
}
