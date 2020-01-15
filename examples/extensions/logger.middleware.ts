import { Service } from "typedi";
import { GraphQLResolveInfo, GraphQLFieldConfig, GraphQLObjectTypeConfig } from "graphql";

import { MiddlewareInterface, NextFn, ResolverData } from "../../src";

import { Context } from "./context.interface";
import { Logger } from "./logger.service";

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

const extractLoggerExtensionsFromConfig = (
  config: GraphQLObjectTypeConfig<any, any> | GraphQLFieldConfig<any, any>,
) => (config.extensions && config.extensions.log) || {};

const getLoggerExtensions = (info: GraphQLResolveInfo) => {
  const fieldConfig = extractFieldConfig(info);
  const fieldLoggernExtensions = extractLoggerExtensionsFromConfig(fieldConfig);

  const parentConfig = extractParentConfig(info);
  const parentLoggernExtensions = extractLoggerExtensionsFromConfig(parentConfig);

  return {
    ...parentLoggernExtensions,
    ...fieldLoggernExtensions,
  };
};

@Service()
export class LoggerMiddleware implements MiddlewareInterface<Context> {
  constructor(private readonly logger: Logger) {}

  async use({ context: { user }, info }: ResolverData<Context>, next: NextFn) {
    const { message, level = 0 } = getLoggerExtensions(info);

    if (message) {
      this.logger.log(`${level}${user ? ` (user: ${user.id})` : ""}`, level);
    }

    return next();
  }
}
