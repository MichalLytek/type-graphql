import { ObjectType, Field } from "../../../../src";

@ObjectType()
export default class Counter {
  @Field()
  value!: number;
}
