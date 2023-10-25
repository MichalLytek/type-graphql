import { type Middleware } from "@/typings/middleware";

export interface MiddlewareMetadata {
  target: Function;
  fieldName: string;
  middlewares: Array<Middleware<any>>;
}
