import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { ProblemCreateManyWithoutCreatorInput } from "../inputs/ProblemCreateManyWithoutCreatorInput";
import { ProblemCreateManyWithoutLikedByInput } from "../inputs/ProblemCreateManyWithoutLikedByInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class CreatorCreateInput {
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

  @TypeGraphQL.Field(_type => ProblemCreateManyWithoutCreatorInput, {
    nullable: true,
    description: undefined
  })
  problems?: ProblemCreateManyWithoutCreatorInput | undefined;
}
