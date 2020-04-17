import * as TypeGraphQL from "type-graphql";
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

  movies?: Movie[] | null;
}
