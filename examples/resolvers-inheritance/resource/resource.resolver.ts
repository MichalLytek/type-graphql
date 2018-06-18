import { Service, Inject } from "typedi";
import { Query, Arg, Int, Resolver, ArgsType, Field, Args, FieldResolver } from "../../../src";

import { Resource } from "./resource";
import { ResourceService, ResourceServiceFactory } from "./resource.service";
import { ClassTypeResolver } from "../../../src/decorators/types";

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
  @Field(type => Int, { nullable: true })
  skip: number = 0;

  @Field(type => Int, { nullable: true })
  take: number = 10;
}

export function createResourceResolver<TResource extends Resource>(
  ResourceClsResolver: ClassTypeResolver,
  resources: TResource[],
): typeof BaseResourceResolver {
  const resourceCls = ResourceClsResolver();
  const resourceName = resourceCls.name.toLocaleLowerCase();
  // this decorator option is mandatory to prevent multiple registering in schema
  @Resolver(of => resourceCls, { isAbstract: true })
  @Service()
  abstract class ResourceResolver extends BaseResourceResolver<TResource> {
    protected resourceService: ResourceService<TResource>;

    constructor(factory: ResourceServiceFactory) {
      super();
      this.resourceService = factory.create(resources);
    }

    @Query(of => resourceCls, { name: `${resourceName}` })
    protected async getOne(
      @Arg("id", type => Int)
      id: number,
    ) {
      return this.resourceService.getOne(id);
    }

    @Query(returns => [resourceCls], { name: `${resourceName}s` })
    protected async getAll(@Args() { skip, take }: GetAllArgs) {
      const all = this.resourceService.getAll(skip, take);
      return all;
    }
    @FieldResolver(of => String)
    protected async resourceName() {
      return "dummy string";
    }
  }

  // workaround for generics conflict
  return ResourceResolver as any;
}
