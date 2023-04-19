import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// eslint-disable-next-line import/no-cycle
import { Recipe } from "./recipe";

@ObjectType()
@Entity()
export class User {
  @Field(_type => ID)
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

  @OneToMany(_type => Recipe, recipe => recipe.author, { lazy: true })
  @Field(_type => [Recipe])
  recipes: Recipe[] | Promise<Recipe[]>;
}
