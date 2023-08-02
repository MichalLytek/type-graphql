import { type Middleware } from "@/typings/Middleware";

export interface MiddlewareMetadata {
  target: Function;
  fieldName: string;
  middlewares: Array<Middleware<any>>;
}
