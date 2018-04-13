import { AfterMiddleware, BeforeMiddleware } from "../../interfaces";

export interface BaseMiddlewareMetadata {
  target: Function;
  fieldName: string;
}

export interface AfterMiddlewareMetadata extends BaseMiddlewareMetadata {
  type: "before";
  middlewares: Array<BeforeMiddleware<any>>;
}

export interface BeforeMiddlewareMetadata extends BaseMiddlewareMetadata {
  type: "after";
  middlewares: Array<AfterMiddleware<any>>;
}

export type MiddlewareMetadata = BeforeMiddlewareMetadata | AfterMiddlewareMetadata;
