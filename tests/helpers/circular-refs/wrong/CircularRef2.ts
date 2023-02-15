import { Field, ObjectType } from "type-graphql";
import { CircularRef1 } from "./CircularRef1";

@ObjectType()
export class CircularRef2 {
  @Field()
  ref1Field: CircularRef1;
}
