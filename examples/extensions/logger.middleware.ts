import { GraphQLFieldConfig, GraphQLObjectTypeConfig, GraphQLResolveInfo } from "graphql";
import { MiddlewareInterface, NextFn, ResolverData } from "type-graphql";
import { Service } from "typedi";
import { Context } from "./context.type";
import { extractFieldConfig, extractParentTypeConfig } from "./helpers/config.extractors";
import { Logger } from "./logger.service";

type LoggerConfig = {
  message?: string;
  level?: number;
};

const extractLoggerExtensionsFromConfig = (
  config: GraphQLObjectTypeConfig<any, any> | GraphQLFieldConfig<any, any>,
): LoggerConfig => (config.extensions && (config.extensions.log as LoggerConfig)) || {};

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

  use({ context: { user }, info }: ResolverData<Context>, next: NextFn) {
    const { message, level = 0 } = getLoggerExtensions(info);

    if (message) {
      this.logger.log(level, `${user ? ` (user: ${user.id})` : ""}`, message);
    }

    return next();
  }
}
