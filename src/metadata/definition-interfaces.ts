import { TypeOptions, TypeValueResolver, ClassTypeResolver } from "../types/decorators";
import { BaseResolverDefinitions } from "../types/resolvers";
import { ValidatorOptions } from "class-validator";

export interface HandlerDefinition extends BaseResolverDefinitions {
  getReturnType: TypeValueResolver;
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
}

export interface FieldDefinition {
  target: Function;
  name: string;
  getType: TypeValueResolver;
  typeOptions: TypeOptions;
  params?: ParamDefinition[];
  description?: string;
  deprecationReason?: string;
}

/* Param definitions */

export interface BasicParamDefinition {
  target: Function;
  methodName: string;
  index: number;
}
export interface SimpleParamDefinition extends BasicParamDefinition {
  kind: "context" | "root";
}
export interface CommonArgDefinition extends BasicParamDefinition {
  getType: TypeValueResolver;
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
export type ParamDefinition = SimpleParamDefinition | ArgParamDefinition | ArgsParamDefinition;
