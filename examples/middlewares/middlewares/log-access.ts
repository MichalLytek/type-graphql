import { Service } from "typedi";
import { MiddlewareInterface, NextFunction, ActionData } from "../../../src";

import { Context } from "../context";
import { Logger } from "../logger";

@Service()
export class LogAccessMiddleware implements MiddlewareInterface<Context> {
  constructor(private readonly logger: Logger) {}

  async use({ context, info }: ActionData<Context>, next: NextFunction) {
    const username: string = context.username || "guest";
    this.logger.log(`Logging access: ${username} -> ${info.parentType.name}.${info.fieldName}`);
    return next();
  }
}
