import { Field, ObjectType } from "../../../src";

import { Person } from "../person/person.type";

@ObjectType()
export class Employee extends Person {
  @Field()
  companyName: string;
}
