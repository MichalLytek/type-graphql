import { Field, ObjectType } from '../../../src'

import { Person } from '../person/person.type'

@ObjectType()
export class Student extends Person {
  @Field()
  universityName: string
}
