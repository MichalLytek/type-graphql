/*
 * Special thanks for @pleerock for this part of code :)
 */

export type SupportedType<T> = { new (...args: any[]): T } | Function;

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
  static userContainer?: { get<T>(someClass: SupportedType<T>): T };
  static userContainerOptions: UseContainerOptions;
  private static defaultContainer = new DefaultContainer();

  /**
   * Sets the container to the basic, default one.
   * Used mainly for testing purposes.
   */
  static restoreDefault() {
    this.userContainer = undefined;
    this.userContainerOptions = {};
  }

  /**
   * Sets container to be used by this library.
   */
  static useContainer(
    iocContainer: { get(someClass: any): any },
    options: UseContainerOptions = {},
  ) {
    this.userContainer = iocContainer;
    this.userContainerOptions = options;
  }

  /**
   * Gets the class instance from IOC container used by this library.
   */
  static getInstance<T = any>(someClass: SupportedType<T>): T {
    if (this.userContainer) {
      try {
        const instance = this.userContainer.get(someClass);
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

export function useContainer(
  iocContainer: { get(someClass: any): any },
  options: UseContainerOptions = {},
) {
  IOCContainer.useContainer(iocContainer, options);
}
