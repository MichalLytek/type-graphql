import { Field, GraphQLObjectType } from "../../../src";

import { Person } from "../person/person.type";

@GraphQLObjectType()
export class Student extends Person {
  @Field()
  universityName: string;
}
