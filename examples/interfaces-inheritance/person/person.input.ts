import { InputType, Field } from '../../../src'

@InputType()
export class PersonInput {
  @Field()
  name: string

  @Field()
  dateOfBirth: Date
}
