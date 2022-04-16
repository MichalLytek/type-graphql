import { Service } from 'typedi'

@Service()
export class Logger {
  log(...args: any[]) {
    // replace with more sophisticated solution :)
    console.log(...args)
  }
}
