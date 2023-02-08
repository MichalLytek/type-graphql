import { Entity, Property, ManyToOne, PrimaryKey, OptionalProps } from "@mikro-orm/core";
import { ObjectType, Field, Int } from "../../../src";

import { User } from "./user";
import { Recipe } from "./recipe";

@Entity()
@ObjectType()
export class Rate {
  @PrimaryKey()
  readonly id: number;

  @Field(type => Int)
  @Property({ type: "smallint" })
  value: number;

  @Field(type => User)
  @ManyToOne(type => User)
  user: User;

  @Field()
  @Property({ onCreate: () => new Date() })
  date: Date;

  @ManyToOne(type => Recipe)
  recipe: Recipe;

  [OptionalProps]?: "date";
}
