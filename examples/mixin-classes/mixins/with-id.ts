import { InputType, ClassType, Field, Int, ObjectType } from "type-graphql";

// adds id property to the base, extended class
export default function withId<TClassType extends ClassType>(BaseClass: TClassType) {
  @ObjectType()
  @InputType()
  class IDTrait extends BaseClass {
    @Field(type => Int)
    id!: number;
  }
  return IDTrait;
}
