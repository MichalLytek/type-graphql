import { Service } from "typedi";
import { MiddlewareInterface, NextFn, ResolverData } from "../../../src";

import { Context } from "../context";
import { Logger } from "../logger";

@Service()
export class LogAccessMiddleware implements MiddlewareInterface<Context> {
  constructor(private readonly logger: Logger) {}

  async use({ context, info }: ResolverData<Context>, next: NextFn) {
    this.logger.log(
      `Logging access: ${context.currentUser.name} -> ${info.parentType.name}.${info.fieldName}`,
    );
    return next();
  }
}
