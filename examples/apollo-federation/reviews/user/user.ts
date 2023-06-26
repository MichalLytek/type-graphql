import { Directive, Field, ID, ObjectType } from "type-graphql";

@Directive("@extends")
@Directive(`@key(fields: "id")`)
@ObjectType()
export class User {
  @Directive("@external")
  @Field(_type => ID)
  id!: string;

  @Directive("@external")
  @Field()
  username!: string;
}
