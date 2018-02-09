import { plainToClass } from "class-transformer";

import { ParamDefinition } from "../metadata/definition-interfaces";
import { convertToType } from "../types/helpers";
import { validateArg } from "./validate-arg";
import { ValidatorOptions } from "class-validator";

export interface ResolverData {
  root: any;
  args: any;
  context: any;
  info: any;
}
export async function getParams(
  params: ParamDefinition[],
  { root, args, context, info }: ResolverData,
  globalValidate: boolean | ValidatorOptions,
): Promise<any[]> {
  return Promise.all(
    params.sort((a, b) => a.index - b.index).map(async paramInfo => {
      switch (paramInfo.kind) {
        case "args":
          return await validateArg(
            convertToType(paramInfo.getType(), args),
            globalValidate,
            paramInfo.validate,
          );
        case "arg":
          return await validateArg(
            convertToType(paramInfo.getType(), args[paramInfo.name]),
            globalValidate,
            paramInfo.validate,
          );
        case "context":
          return context;
        case "root":
          return root;
      }
    }),
  );
}
