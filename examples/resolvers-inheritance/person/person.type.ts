import { Field, Int, ObjectType } from "type-graphql";
import { PersonRole } from "./person.role";
import type { Resource } from "../resource/resource";

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
