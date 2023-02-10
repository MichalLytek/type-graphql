import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { Recipe } from "./recipe";
import { Lazy } from "../helpers";

@ObjectType()
@Entity()
export class User {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column()
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  nickname?: string;

  @Column()
  password: string;

  @OneToMany(type => Recipe, recipe => recipe.author, { lazy: true })
  @Field(type => [Recipe])
  recipes: Lazy<Recipe[]>;
}
