import { Arg, Field, ID, Int, InterfaceType } from "type-graphql";
import type { IResource } from "../resource/resource.interface";

@InterfaceType({
  // workaround for bug: https://github.com/MichalLytek/type-graphql/issues/373
  resolveType: value => value.constructor.name,
})
export abstract class IPerson implements IResource {
  @Field(_type => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(_type => Int)
  age!: number;

  @Field()
  avatar(@Arg("size") _size: number): string {
    throw new Error("Method not implemented.");
  }
}
