import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, RelationId } from "typeorm";
import { Field, ID, ObjectType } from "../../../src";

import { Rate } from "./rate";
import { User } from "./user";

@Entity()
@ObjectType()
export class Recipe {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(type => [Rate])
  @OneToMany(type => Rate, rate => rate.recipe, { cascade: ["insert"] })
  ratings: Rate[];

  @Field(type => User)
  @ManyToOne(type => User)
  author: User;

  @RelationId((recipe: Recipe) => recipe.author)
  authorId: number;
}
