import { Directive, Field, ID, ObjectType } from "type-graphql";

@Directive(`@key(fields: "id")`)
@ObjectType()
export class User {
  @Field(_type => ID)
  id!: string;

  @Field()
  username!: string;

  @Field()
  name!: string;

  @Field()
  birthDate!: string;
}
