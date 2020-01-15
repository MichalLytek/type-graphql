import { GraphQLResolveInfo, GraphQLObjectType } from "graphql";

import { MiddlewareFn } from "../../src";
import { Context } from "./context.interface";
import { UnauthorizedError } from "../../src/errors";

const extractAuthorizationExtensions = (info: GraphQLResolveInfo) => {
  const parentAuthorizationExtensions =
    (info.parentType.extensions && info.parentType.extensions.authorization) || {};
  const returnType = info.returnType as GraphQLObjectType;
  const returnTypeAuthorizationExtensions =
    (returnType.extensions && returnType.extensions.authorization) || {};
  const field = info.parentType.getFields()[info.fieldName];
  const fieldAuthorizationExtensions = (field.extensions && field.extensions.authorization) || {};

  return {
    ...parentAuthorizationExtensions,
    ...returnTypeAuthorizationExtensions,
    ...fieldAuthorizationExtensions,
  };
};

export const AuthorizerMiddleware: MiddlewareFn = async (
  { context: { user }, info }: { context: Context; info: GraphQLResolveInfo },
  next,
) => {
  const { restricted = false, roles = [] } = extractAuthorizationExtensions(info);

  if (restricted) {
    if (!user) {
      // if no user, restrict access
      throw new UnauthorizedError();
    }

    if (roles.length > 0 && !user.roles.some(role => roles.includes(role))) {
      // if the roles don't overlap, restrict access
      throw new UnauthorizedError();
    }
  }

  // grant access in other cases
  return next();
};
