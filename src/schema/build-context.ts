import { GraphQLScalarType } from "graphql";
import { ValidatorOptions } from "class-validator";
import { PubSubEngine, PubSub, PubSubOptions } from "graphql-subscriptions";

import { AuthChecker, AuthMode } from "../interfaces";
import { Middleware } from "../interfaces/Middleware";
import { ContainerType, ContainerGetter, IOCContainer } from "../utils/container";

export type DateScalarMode = "isoDate" | "timestamp";

export interface ScalarsTypeMap {
  type: Function;
  scalar: GraphQLScalarType;
}

export interface BuildContextOptions {
  dateScalarMode?: DateScalarMode;
  scalarsMap?: ScalarsTypeMap[];
  /**
   * Indicates if class-validator should be used to auto validate objects injected into params.
   * You can also directly pass validator options to enable validator with a given options.
   */
  validate?: boolean | ValidatorOptions;
  authChecker?: AuthChecker<any, any>;
  authMode?: AuthMode;
  pubSub?: PubSubEngine | PubSubOptions;
  globalMiddlewares?: Array<Middleware<any>>;
  container?: ContainerType | ContainerGetter<any>;
}

export abstract class BuildContext {
  static dateScalarMode: DateScalarMode;
  static scalarsMaps: ScalarsTypeMap[];
  static validate: boolean | ValidatorOptions;
  static authChecker?: AuthChecker<any, any>;
  static authMode: AuthMode;
  static pubSub: PubSubEngine;
  static globalMiddlewares: Array<Middleware<any>>;
  static container: IOCContainer;

  /**
   * Set static fields with current building context data
   */
  static create(options: BuildContextOptions) {
    if (options.dateScalarMode !== undefined) {
      this.dateScalarMode = options.dateScalarMode;
    }

    if (options.scalarsMap !== undefined) {
      this.scalarsMaps = options.scalarsMap;
    }

    if (options.validate !== undefined) {
      this.validate = options.validate;
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

    this.container = new IOCContainer(options.container);
  }

  /**
   * Restore default settings
   */
  static reset() {
    this.dateScalarMode = "isoDate";
    this.scalarsMaps = [];
    this.validate = true;
    this.authChecker = undefined;
    this.authMode = "error";
    this.pubSub = new PubSub();
    this.globalMiddlewares = [];
    this.container = new IOCContainer();
  }
}

// initialize fields
BuildContext.reset();
