import type { Middleware } from "@/typings/Middleware";

export type MiddlewareMetadata = {
  target: Function;
  fieldName: string;
  middlewares: Middleware<any>[];
};
