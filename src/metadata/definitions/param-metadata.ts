import { ValidatorOptions } from "class-validator";

import { TypeValueThunk, TypeOptions } from "../../types/decorators";

export interface BasicParamMetadata {
  target: Function;
  methodName: string;
  index: number;
}
export interface InfoParamMetadata extends BasicParamMetadata {
  kind: "info";
}
export interface PubSubParamMetadata extends BasicParamMetadata {
  kind: "pubSub";
  triggerKey?: string;
}
export interface ContextParamMetadata extends BasicParamMetadata {
  kind: "context";
  propertyName: string | undefined;
}
export interface RootParamMetadata extends BasicParamMetadata {
  kind: "root";
  propertyName: string | undefined;
  getType: TypeValueThunk | undefined;
}
export interface CommonArgMetadata extends BasicParamMetadata {
  getType: TypeValueThunk;
  typeOptions: TypeOptions;
  validate: boolean | ValidatorOptions | undefined;
}
export interface ArgParamMetadata extends CommonArgMetadata {
  kind: "arg";
  name: string;
  description: string | undefined;
}
export interface ArgsParamMetadata extends CommonArgMetadata {
  kind: "args";
}
// prettier-ignore
export type ParamMetadata =
  | InfoParamMetadata
  | PubSubParamMetadata
  | ContextParamMetadata
  | RootParamMetadata
  | ArgParamMetadata
  | ArgsParamMetadata
;
