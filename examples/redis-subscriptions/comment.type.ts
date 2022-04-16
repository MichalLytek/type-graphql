import { Field, ObjectType } from '../../src'

@ObjectType()
export class Comment {
  @Field({ nullable: true })
  nickname?: string

  @Field()
  content: string

  @Field()
  date: Date
}
