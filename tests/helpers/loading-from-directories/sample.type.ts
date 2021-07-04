import { Field, ObjectType } from "../../../src";

@ObjectType()
export class SampleObject {
  @Field()
  sampleField: string;
}

@ObjectType()
export class SampleObject2 {
  @Field()
  sampleField: string;
}
