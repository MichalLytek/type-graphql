import { InputType, Field } from '../../../src'

import { PersonInput } from '../person/person.input'

@InputType()
export class EmployeeInput extends PersonInput {
  @Field()
  companyName: string
}
