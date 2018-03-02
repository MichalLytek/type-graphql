import { GraphQLFieldResolver } from "graphql";

import { IOCContainer } from "../utils/container";
import { FieldResolverDefinition } from "../metadata/definition-interfaces";
import { getParams } from "./helpers";
import { BaseResolverDefinitions } from "../types/resolvers";
import { convertToType } from "../types/helpers";
import { BuildContext } from "../schema/build-context";
import { AuthCheckerFunc, ActionData } from "../types/auth-checker";

export function createResolver(
  resolverDefinition: BaseResolverDefinitions,
): GraphQLFieldResolver<any, any, any> {
  const targetInstance = IOCContainer.getInstance(resolverDefinition.target);
  const globalValidate = BuildContext.validate;
  const authChecker = BuildContext.authChecker;

  return async (root, args, context, info) => {
    const action: ActionData = { root, args, context, info };
    await checkForAccess(action, authChecker, resolverDefinition.roles);
    const params: any[] = await getParams(resolverDefinition.params!, action, globalValidate);
    return resolverDefinition.handler!.apply(targetInstance, params);
  };
}

export function createFieldResolver(
  fieldResolverDefintion: FieldResolverDefinition,
): GraphQLFieldResolver<any, any, any> {
  if (fieldResolverDefintion.kind === "external") {
    return createResolver(fieldResolverDefintion);
  }

  const authChecker = BuildContext.authChecker;
  const targetType = fieldResolverDefintion.getParentType!();
  return async (root, args, context, info) => {
    const actionData: ActionData = { root, args, context, info };
    await checkForAccess(actionData, authChecker, fieldResolverDefintion.roles);

    const targetInstance: any = convertToType(targetType, root);
    const globalValidate = BuildContext.validate;

    // method
    if (fieldResolverDefintion.handler) {
      const params: any[] = await getParams(
        fieldResolverDefintion.params!,
        actionData,
        globalValidate,
      );
      return fieldResolverDefintion.handler.apply(targetInstance, params);
    }
    // getter
    return targetInstance[fieldResolverDefintion.methodName];
  };
}

async function checkForAccess(action: ActionData, authChecker?: AuthCheckerFunc, roles?: string[]) {
  if (roles && authChecker) {
    const accessGranted = await authChecker(action, roles);
    if (!accessGranted) {
      throw new Error("Acess denied!");
    }
  }
}
