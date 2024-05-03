import { type TypeOptions, type TypeValueThunk } from "@/decorators/types";
import { type ValidateSettings } from "@/schema/build-context";
import { type ResolverData, type ValidatorFn } from "@/typings";

export interface BasicParamMetadata {
  target: Function;
  methodName: string;
  index: number;
}

export type InfoParamMetadata = {
  kind: "info";
} & BasicParamMetadata;

export type PubSubParamMetadata = {
  kind: "pubSub";
  triggerKey?: string;
} & BasicParamMetadata;

export type ContextParamMetadata = {
  kind: "context";
  propertyName: string | undefined;
} & BasicParamMetadata;

export type RootParamMetadata = {
  kind: "root";
  propertyName: string | undefined;
  getType: TypeValueThunk | undefined;
} & BasicParamMetadata;

export type CommonArgMetadata = {
  getType: TypeValueThunk;
  typeOptions: TypeOptions;
  validateSettings: ValidateSettings | undefined;
  validateFn: ValidatorFn | undefined;
} & BasicParamMetadata;

export type ArgParamMetadata = {
  kind: "arg";
  name: string;
  description: string | undefined;
  deprecationReason: string | undefined;
} & CommonArgMetadata;

export type ArgsParamMetadata = {
  kind: "args";
} & CommonArgMetadata;

export type CustomParamMetadata = {
  kind: "custom";
  resolver: (resolverData: ResolverData<any>) => any;
} & BasicParamMetadata;

export type ParamMetadata =
  | InfoParamMetadata
  | PubSubParamMetadata
  | ContextParamMetadata
  | RootParamMetadata
  | ArgParamMetadata
  | ArgsParamMetadata
  | CustomParamMetadata;
