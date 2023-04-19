import { Field, ObjectType } from "type-graphql";
// eslint-disable-next-line import/no-cycle
import { CircularRef2 } from "./CircularRef2";

@ObjectType()
export class CircularRef1 {
  @Field()
  ref2Field: CircularRef2;
}
