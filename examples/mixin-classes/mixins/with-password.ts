import { MinLength } from "class-validator";
import { InputType, ClassType, Field, ObjectType } from "type-graphql";

// adds password property with validation to the base, extended class
export default function withPassword<TClassType extends ClassType>(BaseClass: TClassType) {
  @ObjectType()
  @InputType()
  class PasswordTrait extends BaseClass {
    @MinLength(8)
    @Field()
    password!: string;
  }
  return PasswordTrait;
}
