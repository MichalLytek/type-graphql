// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore 'class-validator' might not be installed by user
import { type ValidatorOptions } from "class-validator";
import { type GraphQLScalarType } from "graphql";
import { PubSub, type PubSubEngine, type PubSubOptions } from "graphql-subscriptions";
import { type AuthChecker, type AuthMode } from "@/typings";
import { type Middleware } from "@/typings/Middleware";
import { type ValidatorFn } from "@/typings/ValidatorFn";
import { type ContainerGetter, type ContainerType, IOCContainer } from "@/utils/container";

export interface ScalarsTypeMap {
  type: Function;
  scalar: GraphQLScalarType;
}

export type ValidateSettings = boolean | ValidatorOptions;

export interface BuildContextOptions {
  scalarsMap?: ScalarsTypeMap[];
  /**
   * Indicates if class-validator should be used to auto validate objects injected into params.
   * You can directly pass validator options to enable validator with a given options.
   */
  validate?: ValidateSettings;
  /**
   * Own validation function to check the args and inputs.
   */
  validateFn?: ValidatorFn;
  authChecker?: AuthChecker<any, any>;
  authMode?: AuthMode;
  pubSub?: PubSubEngine | PubSubOptions;
  globalMiddlewares?: Array<Middleware<any>>;
  container?: ContainerType | ContainerGetter<any>;
  /**
   * Default value for type decorators, like `@Field({ nullable: true })`
   */
  nullableByDefault?: boolean;
  /**
   * Disable inferring default values from property initializers, like `created = new Date();`
   */
  disableInferringDefaultValues?: boolean;
}

export abstract class BuildContext {
  static scalarsMaps: ScalarsTypeMap[];

  static validate: ValidateSettings;

  static validateFn?: ValidatorFn;

  static authChecker?: AuthChecker<any, any>;

  static authMode: AuthMode;

  static pubSub: PubSubEngine;

  static globalMiddlewares: Array<Middleware<any>>;

  static container: IOCContainer;

  static nullableByDefault: boolean;

  static disableInferringDefaultValues: boolean;

  /**
   * Set static fields with current building context data
   */
  static create(options: BuildContextOptions) {
    if (options.scalarsMap !== undefined) {
      this.scalarsMaps = options.scalarsMap;
    }

    if (options.validate !== undefined) {
      this.validate = options.validate;
    }

    if (options.validateFn !== undefined) {
      this.validateFn = options.validateFn;
    }

    if (options.authChecker !== undefined) {
      this.authChecker = options.authChecker;
    }

    if (options.authMode !== undefined) {
      this.authMode = options.authMode;
    }

    if (options.pubSub !== undefined) {
      if ("eventEmitter" in options.pubSub) {
        this.pubSub = new PubSub(options.pubSub as PubSubOptions);
      } else {
        this.pubSub = options.pubSub as PubSubEngine;
      }
    }

    if (options.globalMiddlewares) {
      this.globalMiddlewares = options.globalMiddlewares;
    }

    if (options.nullableByDefault !== undefined) {
      this.nullableByDefault = options.nullableByDefault;
    }

    if (options.disableInferringDefaultValues !== undefined) {
      this.disableInferringDefaultValues = options.disableInferringDefaultValues;
    }

    this.container = new IOCContainer(options.container);
  }

  /**
   * Restore default settings
   */
  static reset() {
    this.scalarsMaps = [];
    this.validate = false;
    this.validateFn = undefined;
    this.authChecker = undefined;
    this.authMode = "error";
    this.pubSub = new PubSub();
    this.globalMiddlewares = [];
    this.container = new IOCContainer();
    this.nullableByDefault = false;
    this.disableInferringDefaultValues = false;
  }
}

// Initialize fields
BuildContext.reset();
