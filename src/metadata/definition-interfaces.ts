import { TypeOptions, TypeValueThunk, ClassTypeResolver, ClassType } from "../types/decorators";
import { BaseResolverDefinitions } from "../types/resolvers";
import { ValidatorOptions } from "class-validator";

export interface HandlerDefinition extends BaseResolverDefinitions {
  getReturnType: TypeValueThunk;
  handler: Function;
  returnTypeOptions: TypeOptions;
  description?: string;
  deprecationReason?: string;
}

export interface FieldResolverDefinition extends BaseResolverDefinitions {
  kind: "internal" | "external";
  handler?: Function;
  getParentType?: ClassTypeResolver;
}

export interface ResolverDefinition {
  target: Function;
  getParentType: ClassTypeResolver;
}

export interface ClassDefinition {
  name: string;
  target: Function;
  fields?: FieldDefinition[];
  description?: string;
  interfaceClasses?: Function[];
}

export interface FieldDefinition {
  target: Function;
  name: string;
  getType: TypeValueThunk;
  typeOptions: TypeOptions;
  params?: ParamDefinition[];
  description?: string;
  deprecationReason?: string;
  roles?: string[];
}

export interface AuthorizationDefinition {
  target: Function;
  fieldName: string;
  roles: string[];
}

export interface EnumDefinition {
  enumObj: object;
  name: string;
  description?: string;
}

export interface UnionDefinition {
  types: ClassType[];
  name: string;
  description?: string;
}
export interface UnionDefinitionWithSymbol extends UnionDefinition {
  symbol: symbol;
}

/* Param definitions */

export interface BasicParamDefinition {
  target: Function;
  methodName: string;
  index: number;
}
export interface ContextParamDefinition extends BasicParamDefinition {
  kind: "context";
}
export interface RootParamDefinition extends BasicParamDefinition {
  kind: "root";
  getType?: TypeValueThunk;
}
export interface CommonArgDefinition extends BasicParamDefinition {
  getType: TypeValueThunk;
  typeOptions: TypeOptions;
  validate?: boolean | ValidatorOptions;
}
export interface ArgParamDefinition extends CommonArgDefinition {
  kind: "arg";
  name: string;
  description?: string;
}
export interface ArgsParamDefinition extends CommonArgDefinition {
  kind: "args";
}
export type ParamDefinition =
  | ContextParamDefinition
  | RootParamDefinition
  | ArgParamDefinition
  | ArgsParamDefinition;
