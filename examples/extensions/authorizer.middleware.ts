import { GraphQLResolveInfo, GraphQLFieldConfig, GraphQLObjectTypeConfig } from "graphql";

import { MiddlewareFn } from "../../src";
import { Context } from "./context.interface";
import { UnauthorizedError } from "../../src/errors";

const extractFieldConfig = (info: GraphQLResolveInfo): GraphQLFieldConfig<any, any> => {
  const { type, extensions, description, deprecationReason } = info.parentType.getFields()[
    info.fieldName
  ];

  return {
    type,
    description,
    extensions,
    deprecationReason,
  };
};

const extractParentConfig = (info: GraphQLResolveInfo): GraphQLObjectTypeConfig<any, any> =>
  info.parentType.toConfig();

const extractAuthorizationExtensionsFromConfig = (
  config: GraphQLObjectTypeConfig<any, any> | GraphQLFieldConfig<any, any>,
) => (config.extensions && config.extensions.authorization) || {};

const getAuthorizationExtensions = (info: GraphQLResolveInfo) => {
  const fieldConfig = extractFieldConfig(info);
  const fieldAuthorizationExtensions = extractAuthorizationExtensionsFromConfig(fieldConfig);

  const parentConfig = extractParentConfig(info);
  const parentAuthorizationExtensions = extractAuthorizationExtensionsFromConfig(parentConfig);

  return {
    ...parentAuthorizationExtensions,
    ...fieldAuthorizationExtensions,
  };
};

export const AuthorizerMiddleware: MiddlewareFn<Context> = async (
  { context: { user }, info },
  next,
) => {
  const { restricted = false, roles = [] } = getAuthorizationExtensions(info);

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
