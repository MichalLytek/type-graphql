import { MinLength } from 'class-validator'
import { InputType, ClassType, Field, ObjectType } from '../../../src'

// adds password property with validation to the base, extended class
export default function withPassword<TClassType extends ClassType>(BaseClass: TClassType) {
  @ObjectType({ isAbstract: true })
  @InputType({ isAbstract: true })
  class PasswordTrait extends BaseClass {
    @MinLength(8)
    @Field()
    password!: string
  }
  return PasswordTrait
}
