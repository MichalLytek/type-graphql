import { Field, ObjectType } from "type-graphql";
import { CircularRef2 } from "./CircularRef2";

@ObjectType()
export class CircularRef1 {
  @Field()
  ref2Field: CircularRef2;
}
