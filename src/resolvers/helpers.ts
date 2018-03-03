import { plainToClass } from "class-transformer";

import { ParamDefinition } from "../metadata/definition-interfaces";
import { convertToType } from "../types/helpers";
import { validateArg } from "./validate-arg";
import { ValidatorOptions } from "class-validator";
import { ActionData, AuthCheckerFunc } from "../types/auth-checker";
import { UnauthorizedError, ForbiddenError } from "../errors";

export async function getParams(
  params: ParamDefinition[],
  { root, args, context, info }: ActionData,
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
          if (!paramInfo.getType) {
            return root;
          }
          return convertToType(paramInfo.getType(), root);
      }
    }),
  );
}

export async function checkForAccess(
  action: ActionData,
  authChecker?: AuthCheckerFunc,
  roles?: string[],
) {
  if (roles && authChecker) {
    const accessGranted = await authChecker(action, roles);
    if (!accessGranted) {
      throw roles.length === 0 ? new UnauthorizedError() : new ForbiddenError();
    }
  }
}
