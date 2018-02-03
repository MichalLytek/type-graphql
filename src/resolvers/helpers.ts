import { plainToClass } from "class-transformer";

import { ParamDefinition } from "../metadata/definition-interfaces";
import { convertToType } from "../types/convert";

export interface ResolverData {
  root: any;
  args: any;
  context: any;
  info: any;
}
export function getParams(
  params: ParamDefinition[],
  { root, args, context, info }: ResolverData,
): any[] {
  return params.sort((a, b) => a.index - b.index).map(paramInfo => {
    switch (paramInfo.kind) {
      case "args":
        return convertToType(paramInfo.getType(), args);
      case "arg":
        return convertToType(paramInfo.getType(), args[paramInfo.name]);
      case "context":
        return context;
      case "root":
        return root;
    }
  });
}
