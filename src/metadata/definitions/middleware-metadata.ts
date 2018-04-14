import { Middleware } from "../../interfaces";

export interface MiddlewareMetadata {
  target: Function;
  fieldName: string;
  middlewares: Array<Middleware<any>>;
}
