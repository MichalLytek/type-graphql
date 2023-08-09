import { Field, InputType } from "type-graphql";
import { PersonInput } from "../person";

@InputType()
export class EmployeeInput extends PersonInput {
  @Field()
  companyName!: string;
}
