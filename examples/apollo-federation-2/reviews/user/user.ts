import { Directive, Field, ID, ObjectType } from "type-graphql";

@Directive(`@key(fields: "id")`)
@ObjectType()
export class User {
  @Field(_type => ID)
  id!: string;

  @Directive("@external")
  @Field()
  username!: string;
}
