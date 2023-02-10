import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class SampleObject {
  @Field()
  sampleField: string;
}
