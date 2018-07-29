/*
 * Special thanks for @pleerock for parts of this code :)
 */

import { ResolverData } from "../interfaces";

export type SupportedType<T> = { new (...args: any[]): T } | Function;

export interface ContainerType {
  get(someClass: any, resolverData: ResolverData<any>): any;
}

export type ContainerGetter<TContext extends object> = (
  resolverData: ResolverData<TContext>,
) => ContainerType;

/**
 * Container options.
 */
export interface UseContainerOptions {
  /**
   * If set to true, then default container will be used in the case
   * if given container haven't returned anything.
   */
  fallback?: boolean;

  /**
   * If set to true, then default container will be used in the case
   * if given container thrown an exception.
   */
  fallbackOnErrors?: boolean;
}

/**
 * Container to be used by this library for inversion control.
 * If container was not implicitly set then by default
 * container simply creates a new instance of the given class.
 */
class DefaultContainer {
  private instances: Array<{ type: Function; object: any }> = [];

  get<T>(someClass: SupportedType<T>): T {
    let instance = this.instances.find(it => it.type === someClass);
    if (!instance) {
      instance = { type: someClass, object: new (someClass as any)() };
      this.instances.push(instance);
    }

    return instance.object;
  }
}

export abstract class IOCContainer {
  private static userContainer?: ContainerType;
  private static userContainerGetter?: ContainerGetter<any>;
  private static userContainerOptions: UseContainerOptions;
  private static defaultContainer = new DefaultContainer();

  /**
   * Sets the container to the basic, default one.
   * Used mainly for testing purposes.
   */
  static restoreDefault() {
    this.userContainer = undefined;
    this.userContainerGetter = undefined;
    this.userContainerOptions = {};
    this.defaultContainer = new DefaultContainer();
  }

  /**
   * Sets container to be used by this library.
   */
  static useContainer(iocContainer: ContainerType, options: UseContainerOptions = {}) {
    this.userContainer = iocContainer;
    this.userContainerGetter = undefined;
    this.userContainerOptions = options;
  }

  /**
   * Sets container getter function to be used by this library.
   */
  static useContainerGetter(
    containerGetter: ContainerGetter<any>,
    options: UseContainerOptions = {},
  ) {
    this.userContainer = undefined;
    this.userContainerGetter = containerGetter;
    this.userContainerOptions = options;
  }

  /**
   * Gets the class instance from IOC container used by this library.
   */
  static getInstance<T = any>(someClass: SupportedType<T>, resolverData: ResolverData<any>): T {
    const container = this.userContainerGetter
      ? this.userContainerGetter(resolverData)
      : this.userContainer;

    if (container) {
      try {
        const instance = container.get(someClass, resolverData);
        if (instance) {
          return instance;
        }

        if (!this.userContainerOptions || !this.userContainerOptions.fallback) {
          return instance;
        }
      } catch (error) {
        if (!this.userContainerOptions || !this.userContainerOptions.fallbackOnErrors) {
          throw error;
        }
      }
    }
    return this.defaultContainer.get<T>(someClass);
  }
}

export function useContainer(iocContainer: ContainerType, options?: UseContainerOptions): void;
export function useContainer<TContext extends object>(
  containerGetter: ContainerGetter<TContext>,
  options?: UseContainerOptions,
): void;
export function useContainer<TContext extends object>(
  iocContainerOrGetFromResolverData: ContainerType | ContainerGetter<TContext>,
  options?: UseContainerOptions,
) {
  if (
    "get" in iocContainerOrGetFromResolverData &&
    typeof iocContainerOrGetFromResolverData.get === "function"
  ) {
    IOCContainer.useContainer(iocContainerOrGetFromResolverData, options);
  } else if (typeof iocContainerOrGetFromResolverData === "function") {
    IOCContainer.useContainerGetter(iocContainerOrGetFromResolverData, options);
  }
}
