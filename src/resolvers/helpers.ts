import { plainToClass } from "class-transformer";

import { ParamMetadata } from "../metadata/definitions";
import { convertToType } from "../helpers/types";
import { validateArg } from "./validate-arg";
import { ValidatorOptions } from "class-validator";
import { ActionData, AuthChecker } from "../types/auth-checker";
import { UnauthorizedError, ForbiddenError } from "../errors";

export async function getParams(
  params: ParamMetadata[],
  { root, args, context, info }: ActionData<any>,
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
          if (paramInfo.propertyName) {
            return context[paramInfo.propertyName];
          }
          return context;
        case "root":
          const rootValue = paramInfo.propertyName ? root[paramInfo.propertyName] : root;
          if (!paramInfo.getType) {
            return rootValue;
          }
          return convertToType(paramInfo.getType(), rootValue);
        case "info":
          return info;
      }
    }),
  );
}

export async function checkForAccess(
  action: ActionData,
  authChecker?: AuthChecker<any>,
  roles?: string[],
) {
  if (roles && authChecker) {
    const accessGranted = await authChecker(action, roles);
    if (!accessGranted) {
      throw roles.length === 0 ? new UnauthorizedError() : new ForbiddenError();
    }
  }
}
