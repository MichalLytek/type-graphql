import { InputType, Field } from "type-graphql";

@InputType()
export class PersonInput {
  @Field()
  name: string;

  @Field()
  dateOfBirth: Date;
}
