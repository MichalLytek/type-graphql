import { TypeValueThunk, TypeOptions, ClassTypeResolver } from "../../types/decorators";
import { ParamMetadata } from "./param-metadata";

export interface BaseResolverMetadata {
  methodName: string;
  target: Function;
  handler?: Function;
  params?: ParamMetadata[];
  roles?: string[];
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
  filter: string[];
}

export interface ResolverClassMetadata {
  target: Function;
  getParentType: ClassTypeResolver;
}
