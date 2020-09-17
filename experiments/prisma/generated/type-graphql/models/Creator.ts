import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../client";
import { Problem } from "../models/Problem";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class Creator {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined,
  })
  id!: number;

  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  name!: string;

  likes?: Problem[] | null;

  problems?: Problem[] | null;
}
