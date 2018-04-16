import { Service } from "typedi";
import { MiddlewareInterface, NextFunction, ActionData } from "../../../src";

import { Context } from "../context";
import { Logger } from "../logger";

@Service()
export class LogAccessMiddleware implements MiddlewareInterface<Context> {
  constructor(private readonly logger: Logger) {}

  async resolve({ context, info }: ActionData<Context>, next: NextFunction) {
    const userName: string = context.username || "guest";
    this.logger.log(`Logging access: ${userName} -> ${info.parentType.name}.${info.fieldName}`);
    return next();
  }
}
