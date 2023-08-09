import { type ClassType, Field, InputType, Int, ObjectType } from "type-graphql";

// Adds 'id' property to the base, extended class
export function withId<TClassType extends ClassType>(BaseClass: TClassType) {
  @ObjectType()
  @InputType()
  class IDTrait extends BaseClass {
    @Field(_type => Int)
    id!: number;
  }

  return IDTrait;
}
