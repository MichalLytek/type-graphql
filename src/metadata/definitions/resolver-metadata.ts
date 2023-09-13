import { type ResolverFn } from "graphql-subscriptions";
import {
  type ClassTypeResolver,
  type SubscriptionFilterFunc,
  type SubscriptionTopicFunc,
  type TypeOptions,
  type TypeValueThunk,
} from "@/decorators/types";
import { type Complexity } from "@/typings";
import { type Middleware } from "@/typings/Middleware";
import { type DirectiveMetadata } from "./directive-metadata";
import { type ExtensionsMetadata } from "./extensions-metadata";
import { type ParamMetadata } from "./param-metadata";

export interface BaseResolverMetadata {
  methodName: string;
  schemaName: string;
  target: Function;
  complexity: Complexity | undefined;
  resolverClassMetadata?: ResolverClassMetadata;
  params?: ParamMetadata[];
  roles?: any[];
  middlewares?: Array<Middleware<any>>;
  directives?: DirectiveMetadata[];
  extensions?: ExtensionsMetadata;
  description?: string;
}

export type ResolverMetadata = {
  getReturnType: TypeValueThunk;
  returnTypeOptions: TypeOptions;
  description?: string;
  deprecationReason?: string;
} & BaseResolverMetadata;

export type FieldResolverMetadata = {
  kind: "internal" | "external";
  description?: string;
  deprecationReason?: string;
  getType?: TypeValueThunk;
  typeOptions?: TypeOptions;
  getObjectType?: ClassTypeResolver;
} & BaseResolverMetadata;

export type SubscriptionResolverMetadata = {
  topics: string | string[] | SubscriptionTopicFunc | undefined;
  filter: SubscriptionFilterFunc | undefined;
  subscribe: ResolverFn | undefined;
} & ResolverMetadata;

export interface ResolverClassMetadata {
  target: Function;
  getObjectType: ClassTypeResolver;
  superResolver?: ResolverClassMetadata;
}
