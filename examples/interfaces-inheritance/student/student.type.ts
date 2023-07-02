import { Field, ObjectType } from "type-graphql";
import { Person } from "../person";

@ObjectType()
export class Student extends Person {
  @Field()
  universityName!: string;
}
