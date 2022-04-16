import { ObjectType, Field, Arg } from '../../../src'

import { IPerson } from './person.interface'

@ObjectType({ implements: IPerson })
export class Person implements IPerson {
  id: string
  name: string
  age: number

  @Field()
  avatar(@Arg('size') size: number): string {
    return `http://i.pravatar.cc/${size}`
  }
}
