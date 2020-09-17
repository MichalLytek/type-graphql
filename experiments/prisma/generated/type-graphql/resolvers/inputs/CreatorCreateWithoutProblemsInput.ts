import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { ProblemCreateManyWithoutLikedByInput } from "../inputs/ProblemCreateManyWithoutLikedByInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class CreatorCreateWithoutProblemsInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @TypeGraphQL.Field(_type => ProblemCreateManyWithoutLikedByInput, {
    nullable: true,
    description: undefined
  })
  likes?: ProblemCreateManyWithoutLikedByInput | undefined;
}
