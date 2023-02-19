import { Inject, Service } from "typedi";
import { Context } from "./context.type";

// Service is recreated for each request (scoped)
@Service()
export class Logger {
  constructor(@Inject("context") private readonly context: Context) {
    console.log("Logger created!");
  }

  log(...messages: any[]) {
    console.log(`(ID ${this.context.requestId}):`, ...messages);
  }
}
