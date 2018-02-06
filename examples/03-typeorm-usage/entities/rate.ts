import { GraphQLObjectType, Field, Int} from "../../../src";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

import { User } from "./user";
import { Recipe } from "./recipe";
import { RelationColumn } from "../helpers";

@Entity()
@GraphQLObjectType()
export class Rate {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field(type => Int)
  @Column({ type: "int" })
  value: number;

  @Field(type => User)
  @ManyToOne(type => User)
  user: User;

  @Field()
  @CreateDateColumn()
  date: Date;

  @RelationColumn()
  userId: number;

  @ManyToOne(type => Recipe)
  recipe: Recipe;

  @RelationColumn()
  recipeId: number;
}
