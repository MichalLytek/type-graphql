import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { CreatorCreateManyWithoutLikesInput } from "../inputs/CreatorCreateManyWithoutLikesInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class ProblemCreateWithoutCreatorInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined
  })
  problemText!: string;

  @TypeGraphQL.Field(_type => CreatorCreateManyWithoutLikesInput, {
    nullable: true,
    description: undefined
  })
  likedBy?: CreatorCreateManyWithoutLikesInput | undefined;
}
