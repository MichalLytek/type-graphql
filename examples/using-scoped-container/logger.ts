import { Service, Inject } from 'typedi'

import { Context } from './types'

// this service will be recreated for each request (scoped)
@Service()
export class Logger {
  constructor(@Inject('context') private readonly context: Context) {
    console.log('Logger created!')
  }

  log(...messages: any[]): void {
    console.log(`(ID ${this.context.requestId}):`, ...messages)
  }
}
