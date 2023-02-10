import { Directive, ObjectType, Field, ID } from "type-graphql";

@Directive("@extends")
@Directive(`@key(fields: "id")`)
@ObjectType()
export default class User {
  @Directive("@external")
  @Field(type => ID)
  id: string;

  @Directive("@external")
  @Field()
  username: string;
}
