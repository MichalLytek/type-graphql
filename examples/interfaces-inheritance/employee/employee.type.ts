import { Field, ObjectType } from "type-graphql";

import { Person } from "../person/person.type";

@ObjectType()
export class Employee extends Person {
  @Field()
  companyName: string;
}
