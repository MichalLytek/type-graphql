import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "type-graphql";
import { Rating } from "./rating";
import { User } from "./user";

@Entity()
@ObjectType()
export class Recipe {
  @Field(_type => ID)
  @PrimaryKey()
  readonly id!: number;

  @Field()
  @Property()
  title!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  description?: string;

  @Field(_type => [Rating])
  @OneToMany(_type => Rating, rating => rating.recipe)
  ratings = new Collection<Rating>(this);

  @Field(_type => User)
  @ManyToOne(_type => User)
  author!: User;
}
