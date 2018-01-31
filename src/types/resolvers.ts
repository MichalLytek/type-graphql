import { ParamDefinition } from "../metadata/definition-interfaces";

export interface BaseResolverDefinitions {
  methodName: string;
  handler: Function;
  target: Function;
  params?: ParamDefinition[];
}
