import { Field, ObjectType } from "type-graphql";
// eslint-disable-next-line import/no-cycle
import { CircularRef1 } from "./CircularRef1";

@ObjectType()
export class CircularRef2 {
  @Field()
  ref1Field: CircularRef1;
}
