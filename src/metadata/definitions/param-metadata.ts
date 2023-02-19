import { TypeOptions, TypeValueThunk } from "@/decorators/types";
import { ResolverData } from "@/interfaces";
import { ValidateSettings } from "@/schema/build-context";

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
  validate: ValidateSettings | undefined;
}
export interface ArgParamMetadata extends CommonArgMetadata {
  kind: "arg";
  name: string;
  description: string | undefined;
  deprecationReason: string | undefined;
}
export interface ArgsParamMetadata extends CommonArgMetadata {
  kind: "args";
}
export interface CustomParamMetadata extends BasicParamMetadata {
  kind: "custom";
  resolver: (resolverData: ResolverData<any>) => any;
}
// prettier-ignore
export type ParamMetadata =
  | InfoParamMetadata
  | PubSubParamMetadata
  | ContextParamMetadata
  | RootParamMetadata
  | ArgParamMetadata
  | ArgsParamMetadata
  | CustomParamMetadata
;
