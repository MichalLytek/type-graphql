import { Entity, ManyToOne, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
import { Recipe } from "./recipe";
import { User } from "./user";

@Entity()
@ObjectType()
export class Rating {
  @PrimaryKey()
  readonly id!: number;

  @Field(_type => Int)
  @Property({ type: "smallint" })
  value!: number;

  @Field(_type => User)
  @ManyToOne(_type => User)
  user!: User;

  @Field()
  @Property({ onCreate: () => new Date() })
  date!: Date;

  @ManyToOne(_type => Recipe)
  recipe!: Recipe;

  [OptionalProps]?: "date";
}
