import { Field, GraphQLObjectType } from "../../../src";

import { Person } from "../person/person.type";

@GraphQLObjectType()
export class Employee extends Person {
  @Field()
  companyName: string;
}
