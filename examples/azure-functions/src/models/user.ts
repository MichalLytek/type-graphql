import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  email?: string;
}
