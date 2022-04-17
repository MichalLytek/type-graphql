import { Service } from 'typedi'

@Service()
export class Logger {
  log(...args: any[]): void {
    // replace with more sophisticated solution :)
    console.log(...args)
  }
}
