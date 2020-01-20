import { Service } from "typedi";
import { GraphQLResolveInfo, GraphQLFieldConfig, GraphQLObjectTypeConfig } from "graphql";

import { MiddlewareInterface, NextFn, ResolverData } from "../../src";
import { extractFieldConfig, extractParentTypeConfig } from "../../src/helpers/resolveInfo";

import { Context } from "./context.interface";
import { Logger } from "./logger.service";

const extractLoggerExtensionsFromConfig = (
  config: GraphQLObjectTypeConfig<any, any> | GraphQLFieldConfig<any, any>,
) => (config.extensions && config.extensions.log) || {};

const getLoggerExtensions = (info: GraphQLResolveInfo) => {
  const fieldConfig = extractFieldConfig(info);
  const fieldLoggerExtensions = extractLoggerExtensionsFromConfig(fieldConfig);

  const parentConfig = extractParentTypeConfig(info);
  const parentLoggerExtensions = extractLoggerExtensionsFromConfig(parentConfig);

  return {
    ...parentLoggerExtensions,
    ...fieldLoggerExtensions,
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
