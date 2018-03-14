import { Field, GraphQLObjectType } from "../../../src";

@GraphQLObjectType()
export class SampleObject {
  @Field() sampleField: string;
}
