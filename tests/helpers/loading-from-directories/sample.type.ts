import { Field, ObjectType } from "../../../src";

@ObjectType()
export class SampleObject {
  @Field() sampleField: string;
}
