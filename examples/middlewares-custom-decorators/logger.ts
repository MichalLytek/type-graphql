import { Service } from "typedi";

@Service()
export class Logger {
  log(...args: any[]) {
    // Replace with a more sophisticated solution
    console.log(...args);
  }
}
