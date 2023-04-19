import { Field, Int, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
  @ManyToOne(_type => User, { lazy: true })
  user: User | Promise<User>;

  @Field()
  @CreateDateColumn()
  date: Date;

  @ManyToOne(_type => Recipe, { lazy: true })
  recipe: Recipe | Promise<Recipe>;
}
