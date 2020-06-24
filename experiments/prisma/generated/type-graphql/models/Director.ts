import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../client";
import { Movie } from "../models/Movie";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class Director {
  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  firstName!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  lastName!: string;

  movies?: Movie[] | undefined;
}
