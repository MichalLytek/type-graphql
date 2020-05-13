import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { Director } from "../models/Director";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class Movie {
  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  directorFirstName!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  directorLastName!: string;

  director?: Director;

  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  title!: string;
}
