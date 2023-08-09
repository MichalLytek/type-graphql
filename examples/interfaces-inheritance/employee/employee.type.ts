import { Field, ObjectType } from "type-graphql";
import { Person } from "../person";

@ObjectType()
export class Employee extends Person {
  @Field()
  companyName!: string;
}
