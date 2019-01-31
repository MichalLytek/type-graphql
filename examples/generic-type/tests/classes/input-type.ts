import { Field, ObjectType } from "../../../../src";

@ObjectType()
export class ClassInputType {
  @Field(type => String)
  hello: string;
}
