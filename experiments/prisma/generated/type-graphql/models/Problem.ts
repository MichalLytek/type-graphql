import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../client";
import { Creator } from "../models/Creator";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class Problem {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined,
  })
  id!: number;

  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  problemText!: string;

  likedBy?: Creator[] | null;

  creator?: Creator | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true,
    description: undefined,
  })
  creatorId?: number | null;
}
