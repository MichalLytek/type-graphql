import { TypeOptions } from "../types";

export interface HandlerDefinition {
  methodName: string;
  handler: Function;
  target: Function;
  returnType: any;
  returnTypeOptions: TypeOptions;
  params?: ParamDefinition[];
}
export interface FieldResolverDefinition extends HandlerDefinition {
  type: "internal" | "external";
  parentType?: Function;
}

export interface ResolverDefinition {
  target: Function;
  parentType: Function;
}

export interface ClassDefinition {
  name: string;
  target: Function;
  fields?: FieldDefinition[];
}

export interface FieldDefinition {
  target: Function;
  name: string;
  type: object;
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
  type: Function;
  name: string;
}
export interface ArgsParamDefinition extends BasicParamDefinition {
  kind: "args";
  type: Function;
}
export type ParamDefinition = SimpleParamDefinition | ArgParamDefinition | ArgsParamDefinition;
