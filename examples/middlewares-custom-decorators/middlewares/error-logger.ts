import {
  ArgumentValidationError,
  type MiddlewareInterface,
  type NextFn,
  type ResolverData,
} from "type-graphql";
import { Service } from "typedi";
import { type Context } from "../context.type";
import { Logger } from "../logger";

@Service()
export class ErrorLoggerMiddleware implements MiddlewareInterface<Context> {
  constructor(private readonly logger: Logger) {}

  async use({ context, info }: ResolverData<Context>, next: NextFn) {
    try {
      return await next();
    } catch (err) {
      this.logger.log({
        message: (err as Error).message,
        operation: info.operation.operation,
        fieldName: info.fieldName,
        userName: context.currentUser.name,
      });
      if (!(err instanceof ArgumentValidationError)) {
        // Hide errors from db like printing sql query
        throw new Error("Unknown error occurred. Try again later!");
      }
      throw err;
    }
  }
}
