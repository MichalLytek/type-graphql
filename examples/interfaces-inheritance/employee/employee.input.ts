import { GraphQLInputType, Field } from "../../../src";

import { PersonInput } from "../person/person.input";

@GraphQLInputType()
export class EmployeeInput extends PersonInput {
  @Field()
  companyName: string;
}
