import { ParamDefinition } from "../metadata/definition-interfaces";

export interface BaseResolverDefinitions {
  methodName: string;
  target: Function;
  handler?: Function;
  params?: ParamDefinition[];
  roles?: string[];
}
