import { Query, Arg, Int, Resolver } from "../../../src";

import { Resource } from "./resource";

// workaround for `return type of exported function has or is using private name`
export abstract class BaseResourceResolver<TResource extends Resource> {
  protected resources: TResource[];

  protected async getOne(id: number): Promise<TResource | undefined> {
    throw new Error("Method not implemented.");
  }

  protected async getAll(): Promise<TResource[]> {
    throw new Error("Method not implemented.");
  }
}

export function createResourceResolver<TResource extends Resource>(
  ResourceCls: Function,
  resources: TResource[],
): typeof BaseResourceResolver {
  const resourceName = ResourceCls.name.toLocaleLowerCase();

  // this decorator option is mandatory to prevent multiple registering in schema
  @Resolver({ isAbstract: true })
  class ResourceResolver extends BaseResourceResolver<TResource> {
    protected resources: TResource[] = resources;

    @Query(returns => ResourceCls, { name: `${resourceName}` })
    protected async getOne(
      @Arg("id", type => Int)
      id: number,
    ) {
      return this.resources.find(res => res.id === id);
    }

    @Query(returns => [ResourceCls], { name: `${resourceName}s` })
    protected async getAll() {
      return this.resources;
    }
  }

  // workaround for generics conflict
  return ResourceResolver as any;
}
