import { TypeOptions, TypeValueResolver, TypeValue, ClassTypeResolver } from "../types";

export interface HandlerDefinition {
  methodName: string;
  handler: Function;
  target: Function;
  getReturnType: TypeValueResolver;
  returnTypeOptions: TypeOptions;
  params?: ParamDefinition[];
}
export interface FieldResolverDefinition extends HandlerDefinition {
  kind: "internal" | "external";
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
}

export interface FieldDefinition {
  target: Function;
  name: string;
  getType: TypeValueResolver;
  typeOptions: TypeOptions;
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
export interface ArgParamDefinition extends BasicParamDefinition {
  kind: "arg";
  getType: TypeValueResolver;
  name: string;
}
export interface ArgsParamDefinition extends BasicParamDefinition {
  kind: "args";
  getType: TypeValueResolver;
}
export type ParamDefinition = SimpleParamDefinition | ArgParamDefinition | ArgsParamDefinition;
