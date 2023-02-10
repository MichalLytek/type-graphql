import { Field, ObjectType } from "type-graphql";

import { Person } from "../person/person.type";

@ObjectType()
export class Student extends Person {
  @Field()
  universityName: string;
}
