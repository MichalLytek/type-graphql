import { ObjectType, Field, Int } from "../../../src";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

import { User } from "./user";
import { Recipe } from "./recipe";
import { Lazy } from "../helpers";

@Entity()
@ObjectType()
export class Rate {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field(type => Int)
  @Column({ type: "int" })
  value: number;

  @Field(type => User)
  @ManyToOne(type => User, { lazy: true })
  user: Lazy<User>;

  @Field()
  @CreateDateColumn()
  date: Date;

  @ManyToOne(type => Recipe, { lazy: true })
  recipe: Lazy<Recipe>;
}
