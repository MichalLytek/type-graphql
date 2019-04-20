import { InterfaceType, Field, Int, ID, Arg } from "../../../src";

import { IResource } from "../resource/resource.interface";

@InterfaceType()
export abstract class IPerson implements IResource {
  @Field(type => ID)
  id: string;

  @Field()
  name: string;

  @Field(type => Int)
  age: number;

  @Field()
  avatar(@Arg("size") size: number): string {
    throw new Error("Method not implemented.");
  }
}
