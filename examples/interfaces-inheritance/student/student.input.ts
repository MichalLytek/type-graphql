import { GraphQLInputType, Field } from "../../../src";

import { PersonInput } from "../person/person.input";

@GraphQLInputType()
export class StudentInput extends PersonInput {
  @Field()
  universityName: string;
}
