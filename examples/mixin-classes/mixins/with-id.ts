import { InputType, ClassType, Field, Int, ObjectType } from '../../../src'

// adds id property to the base, extended class
export default function withId<TClassType extends ClassType>(BaseClass: TClassType): any {
  @ObjectType({ isAbstract: true })
  @InputType({ isAbstract: true })
  class IDTrait extends BaseClass {
    @Field(type => Int)
    id!: number
  }
  return IDTrait
}
