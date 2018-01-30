import { plainToClass } from "class-transformer";

import { ParamDefinition } from "../metadata/definition-interfaces";

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
        return plainToClass(paramInfo.getType() as any, args);
      case "arg":
        return plainToClass(paramInfo.getType() as any, args[paramInfo.name]);
      case "context":
        return context;
      case "root":
        return root;
    }
  });
}
