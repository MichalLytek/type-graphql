import { ObjectType, Field, Int } from '../../../src'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, RelationId } from 'typeorm'

import { User } from './user'
import { Recipe } from './recipe'

@Entity()
@ObjectType()
export class Rate {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Field(type => Int)
  @Column({ type: 'int' })
  value: number

  @Field(type => User)
  @ManyToOne(type => User)
  user: User

  @RelationId((rate: Rate) => rate.user)
  userId: number

  @Field()
  @CreateDateColumn()
  date: Date

  @ManyToOne(type => Recipe)
  recipe: Recipe

  @RelationId((rate: Rate) => rate.recipe)
  recipeId: number
}
