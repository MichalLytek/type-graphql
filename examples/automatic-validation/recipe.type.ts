import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Recipe {
  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  creationDate!: Date;
}
