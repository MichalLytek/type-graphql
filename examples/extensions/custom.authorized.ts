import { Extensions } from "../../src";

export const CustomAuthorized = (roles: string | string[] = []) =>
  Extensions({
    authorization: {
      restricted: true,
      roles: typeof roles === "string" ? [roles] : roles,
    },
  });
