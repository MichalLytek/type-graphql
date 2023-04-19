import { Field, Int, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
// eslint-disable-next-line import/no-cycle
import { Recipe } from "./recipe";
import { User } from "./user";

@Entity()
@ObjectType()
export class Rating {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field(_type => Int)
  @Column({ type: "int" })
  value: number;

  @Field(_type => User)
  @ManyToOne(_type => User)
  user: User;

  @RelationId((rate: Rating) => rate.user)
  userId: number;

  @Field()
  @CreateDateColumn()
  date: Date;

  @ManyToOne(_type => Recipe)
  recipe: Recipe;

  @RelationId((rate: Rating) => rate.recipe)
  recipeId: number;
}
