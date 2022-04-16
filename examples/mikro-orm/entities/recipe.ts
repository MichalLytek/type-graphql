import { PrimaryKey, Property, ManyToOne, OneToMany, Collection, Entity } from '@mikro-orm/core'
import { Field, ID, ObjectType } from '../../../src'

import { Rate } from './rate'
import { User } from './user'

@Entity()
@ObjectType()
export class Recipe {
  @Field(type => ID)
  @PrimaryKey()
  readonly id: number

  @Field()
  @Property()
  title: string

  @Field({ nullable: true })
  @Property({ nullable: true })
  description?: string

  @Field(type => [Rate])
  @OneToMany(type => Rate, rate => rate.recipe)
  ratings = new Collection<Rate>(this)

  @Field(type => User)
  @ManyToOne(type => User)
  author: User
}
