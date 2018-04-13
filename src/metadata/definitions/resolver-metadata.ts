import {
  TypeValueThunk,
  TypeOptions,
  ClassTypeResolver,
  SubscriptionFilterFunc,
} from "../../types/decorators";
import { ParamMetadata } from "./param-metadata";
import { BeforeMiddleware, AfterMiddleware } from "../../interfaces";

export interface BaseResolverMetadata {
  methodName: string;
  target: Function;
  handler?: Function;
  params?: ParamMetadata[];
  roles?: string[];
  beforeMiddlewares?: Array<BeforeMiddleware<any>>;
  afterMiddlewares?: Array<AfterMiddleware<any>>;
}

export interface ResolverMetadata extends BaseResolverMetadata {
  getReturnType: TypeValueThunk;
  handler: Function;
  returnTypeOptions: TypeOptions;
  description?: string;
  deprecationReason?: string;
}

export interface FieldResolverMetadata extends BaseResolverMetadata {
  kind: "internal" | "external";
  handler?: Function;
  getParentType?: ClassTypeResolver;
}

export interface SubscriptionResolverMetadata extends ResolverMetadata {
  topics: string[];
  filter?: SubscriptionFilterFunc;
}

export interface ResolverClassMetadata {
  target: Function;
  getParentType: ClassTypeResolver;
}
