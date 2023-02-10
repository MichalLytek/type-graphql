import { PrimaryKey, Property, Entity } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field(type => ID)
  @PrimaryKey()
  readonly id: number;

  @Field()
  @Property()
  email: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  nickname?: string;

  @Property()
  password: string;
}
