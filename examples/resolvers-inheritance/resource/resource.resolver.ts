import type { ClassType } from "type-graphql";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  Int,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Service } from "typedi";
import { Resource } from "./resource";
import type { ResourceService } from "./resource.service";
import { ResourceServiceFactory } from "./resource.service";

@ArgsType()
export class GetAllArgs {
  @Field(type => Int)
  skip = 0;

  @Field(type => Int)
  take = 10;
}

export function ResourceResolver<TResource extends Resource>(
  ResourceCls: ClassType<TResource>,
  resources: TResource[],
) {
  const resourceName = ResourceCls.name.toLocaleLowerCase();

  @Resolver(of => ResourceCls)
  @Service()
  abstract class ResourceResolverClass {
    protected resourceService: ResourceService<TResource>;

    constructor(factory: ResourceServiceFactory) {
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

  return ResourceResolverClass;
}
