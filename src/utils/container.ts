/* eslint-disable max-classes-per-file */
import { ResolverData } from "~/interfaces";

export type SupportedType<T> = { new (...args: any[]): T } | Function;

export interface ContainerType {
  get(someClass: any, resolverData: ResolverData<any>): any | Promise<any>;
}

export type ContainerGetter<TContext extends object> = (
  resolverData: ResolverData<TContext>,
) => ContainerType;

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

export class IOCContainer {
  private container: ContainerType | undefined;

  private containerGetter: ContainerGetter<any> | undefined;

  private defaultContainer = new DefaultContainer();

  constructor(iocContainerOrContainerGetter?: ContainerType | ContainerGetter<any>) {
    if (
      iocContainerOrContainerGetter &&
      "get" in iocContainerOrContainerGetter &&
      typeof iocContainerOrContainerGetter.get === "function"
    ) {
      this.container = iocContainerOrContainerGetter;
    } else if (typeof iocContainerOrContainerGetter === "function") {
      this.containerGetter = iocContainerOrContainerGetter;
    }
  }

  getInstance<T = any>(
    someClass: SupportedType<T>,
    resolverData: ResolverData<any>,
  ): T | Promise<T> {
    const container = this.containerGetter ? this.containerGetter(resolverData) : this.container;
    if (!container) {
      return this.defaultContainer.get<T>(someClass);
    }
    return container.get(someClass, resolverData);
  }
}
