import { InputType, Field } from '../../../src'

import { PersonInput } from '../person/person.input'

@InputType()
export class StudentInput extends PersonInput {
  @Field()
  universityName: string
}
