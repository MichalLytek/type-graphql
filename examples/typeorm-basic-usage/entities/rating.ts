import { Field, Int, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { Recipe } from "./recipe";
import { User } from "./user";

@Entity()
@ObjectType()
export class Rating {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Field(_type => Int)
  @Column({ type: "int" })
  value!: number;

  @Field(_type => User)
  @ManyToOne(_type => User)
  user!: User;

  @RelationId((rating: Rating) => rating.user)
  userId!: number;

  @Field()
  @CreateDateColumn()
  date!: Date;

  @ManyToOne(_type => Recipe)
  recipe!: Recipe;

  @RelationId((rating: Rating) => rating.recipe)
  recipeId!: number;
}
