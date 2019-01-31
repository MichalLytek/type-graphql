import { Field, ObjectType, InputType, ArgsType } from "../../../../src";

@ObjectType()
export class ClassInputType {
  @Field(type => String)
  hello: string;
}
