import { Field, GraphQLObjectType } from "../../../../src";

import { CircularRef2 } from "./CircularRef2";

@GraphQLObjectType()
export class CircularRef1 {
  @Field(type => CircularRef2) ref2Field: any;
}
