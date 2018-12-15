import { Service } from "typedi";
import {
  Query,
  Arg,
  Int,
  Resolver,
  ArgsType,
  Field,
  Args,
  FieldResolver,
  Root,
  ClassType,
} from "../../../src";

import { Resource } from "./resource";
import { ResourceService, ResourceServiceFactory } from "./resource.service";

// workaround for `return type of exported function has or is using private name`
export abstract class BaseResourceResolver<TResource extends Resource> {
  protected resourceService: ResourceService<TResource>;

  protected async getOne(id: number): Promise<TResource | undefined> {
    throw new Error("Method not implemented.");
  }

  protected async getAll(args: GetAllArgs): Promise<TResource[]> {
    throw new Error("Method not implemented.");
  }
}

@ArgsType()
export class GetAllArgs {
  @Field(type => Int)
  skip: number = 0;

  @Field(type => Int)
  take: number = 10;
}

export function createResourceResolver<TResource extends Resource>(
  ResourceCls: ClassType,
  resources: TResource[],
): typeof BaseResourceResolver {
  const resourceName = ResourceCls.name.toLocaleLowerCase();

  // `isAbstract` decorator option is mandatory to prevent multiple registering in schema
  @Resolver(of => ResourceCls, { isAbstract: true })
  @Service()
  abstract class ResourceResolver extends BaseResourceResolver<TResource> {
    protected resourceService: ResourceService<TResource>;

    constructor(factory: ResourceServiceFactory) {
      super();
      this.resourceService = factory.create(resources);
    }

    @Query(returns => ResourceCls, { name: `${resourceName}` })
    protected async getOne(@Arg("id", type => Int) id: number) {
      return this.resourceService.getOne(id);
    }

    @Query(returns => [ResourceCls], { name: `${resourceName}s` })
    protected async getAll(@Args() { skip, take }: GetAllArgs) {
      const all = this.resourceService.getAll(skip, take);
      return all;
    }

    // dynamically created field with resolver for all child resource classes
    @FieldResolver({ name: "uuid" })
    protected getUuid(@Root() resource: Resource): string {
      return `${resourceName}_${resource.id}`;
    }
  }

  // workaround for generics conflict
  return ResourceResolver as any;
}
