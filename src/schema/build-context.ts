import { GraphQLScalarType } from 'graphql'
import type { ValidatorOptions } from 'class-validator'
import { PubSub, PubSubEngine, PubSubOptions } from 'graphql-subscriptions'

import { AuthChecker, AuthMode } from '../interfaces'
import { Middleware } from '../interfaces/Middleware'
import { ContainerGetter, ContainerType, IOCContainer } from '../utils/container'
import { ValidatorFn } from '../interfaces/ValidatorFn'

export type DateScalarMode = 'isoDate' | 'timestamp'

export interface ScalarsTypeMap {
  type: Function
  scalar: GraphQLScalarType
}

export type ValidateSettings = boolean | ValidatorOptions | ValidatorFn<object>

export interface BuildContextOptions {
  dateScalarMode?: DateScalarMode
  scalarsMap?: ScalarsTypeMap[]
  /**
   * Indicates if class-validator should be used to auto validate objects injected into params.
   * You can directly pass validator options to enable validator with a given options.
   * Also, you can provide your own validation function to check the args.
   */
  validate?: ValidateSettings
  authChecker?: AuthChecker<any, any>
  authMode?: AuthMode
  pubSub?: PubSubEngine | PubSubOptions
  globalMiddlewares?: Array<Middleware<any>>
  container?: ContainerType | ContainerGetter<any>
  /**
   * Default value for type decorators, like `@Field({ nullable: true })`
   */
  nullableByDefault?: boolean
  /**
   * Disable inferring default values from property initializers, like `created = new Date();`
   */
  disableInferringDefaultValues?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class BuildContext {
  static dateScalarMode: DateScalarMode
  static scalarsMaps: ScalarsTypeMap[]
  static validate: ValidateSettings
  static authChecker?: AuthChecker<any, any>
  static authMode: AuthMode
  static pubSub: PubSubEngine
  static globalMiddlewares: Array<Middleware<any>>
  static container: IOCContainer
  static nullableByDefault: boolean
  static disableInferringDefaultValues: boolean

  /**
   * Set static fields with current building context data
   */
  static create(options: BuildContextOptions): void {
    if (options.dateScalarMode !== undefined) {
      this.dateScalarMode = options.dateScalarMode
    }

    if (options.scalarsMap !== undefined) {
      this.scalarsMaps = options.scalarsMap
    }

    if (options.validate !== undefined) {
      this.validate = options.validate
    }

    if (options.authChecker !== undefined) {
      this.authChecker = options.authChecker
    }

    if (options.authMode !== undefined) {
      this.authMode = options.authMode
    }

    if (options.pubSub !== undefined) {
      if ('eventEmitter' in options.pubSub) {
        this.pubSub = new PubSub(options.pubSub)
      } else {
        this.pubSub = options.pubSub as PubSubEngine
      }
    }

    if (options.globalMiddlewares) {
      this.globalMiddlewares = options.globalMiddlewares
    }

    if (options.nullableByDefault !== undefined) {
      this.nullableByDefault = options.nullableByDefault
    }

    if (options.disableInferringDefaultValues !== undefined) {
      this.disableInferringDefaultValues = options.disableInferringDefaultValues
    }

    this.container = new IOCContainer(options.container)
  }

  /**
   * Restore default settings
   */
  static reset(): void {
    this.dateScalarMode = 'isoDate'
    this.scalarsMaps = []
    this.validate = true
    this.authChecker = undefined
    this.authMode = 'error'
    this.pubSub = new PubSub()
    this.globalMiddlewares = []
    this.container = new IOCContainer()
    this.nullableByDefault = false
    this.disableInferringDefaultValues = false
  }
}

// initialize fields
BuildContext.reset()
