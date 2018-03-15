import { Field, ObjectType } from "../../../../src";

import { CircularRef1 } from "./CircularRef1";

@ObjectType()
export class CircularRef2 {
  @Field(type => CircularRef1) ref1Field: any;
}
