import { Service } from "typedi";
import { MiddlewareInterface, NextFn, ResolverData } from "../../src";

import { Context } from "./context.interface";
import { Logger } from "./logger";

@Service()
export class LoggerMiddleware implements MiddlewareInterface<Context> {
  constructor(private readonly logger: Logger) {}

  async use({ context: { user }, info }: ResolverData<Context>, next: NextFn) {
    const { logMessage, logLevel = 0 } =
      info.parentType.getFields()[info.fieldName].extensions || {};

    if (logMessage) {
      this.logger.log(`${logMessage}${user ? ` (user: ${user.id})` : ""}`, logLevel);
    }

    return next();
  }
}
