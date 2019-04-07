import { ObjectType, Field, Int } from "../../../src";

import { Resource } from "../resource/resource";
import { PersonRole } from "./person.role";

@ObjectType()
export class Person implements Resource {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field(type => Int)
  age: number;

  @Field(type => PersonRole)
  role: PersonRole;
}
