import { InterfaceType, Field, Int, ID } from "../../../src";

import { IResource } from "../resource/resource.interface";

@InterfaceType({
  // workaround for bug: https://github.com/MichalLytek/type-graphql/issues/373
  resolveType: value => value.constructor.name,
})
export abstract class IPerson implements IResource {
  @Field(type => ID)
  id: string;

  @Field()
  name: string;

  @Field(type => Int)
  age: number;
}
