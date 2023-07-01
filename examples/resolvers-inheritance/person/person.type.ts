import { Field, Int, ObjectType } from "type-graphql";
import { PersonRole } from "./person.role";
import type { Resource } from "../resource";

@ObjectType()
export class Person implements Resource {
  @Field()
  id!: number;

  @Field()
  name!: string;

  @Field(_type => Int)
  age!: number;

  @Field(_type => PersonRole)
  role!: PersonRole;
}
