import { Field, GraphQLObjectType } from "../../../../src";

import { CircularRef1 } from "./CircularRef1";

@GraphQLObjectType()
export class CircularRef2 {
  @Field(type => CircularRef1) ref1Field: any;
}
