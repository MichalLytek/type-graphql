import { ObjectType, Field } from "../../../src";

@ObjectType()
export class Car {
  @Field(type => String)
  mark: string;

  constructor(mark: string) {
    this.mark = mark;
  }
}
