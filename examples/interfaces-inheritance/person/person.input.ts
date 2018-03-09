import { GraphQLInputType, Field } from "../../../src";

@GraphQLInputType()
export class PersonInput {
  @Field()
  name: string;

  @Field()
  dateOfBirth: Date;
}
