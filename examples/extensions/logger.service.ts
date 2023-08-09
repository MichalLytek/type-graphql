import { Service } from "typedi";

@Service()
export class Logger {
  log(...args: unknown[]) {
    console.log(...args);
  }
}
