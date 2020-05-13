import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { PostCreateInput } from "../../../inputs/PostCreateInput";

@TypeGraphQL.ArgsType()
export class CreatePostArgs {
  @TypeGraphQL.Field(_type => PostCreateInput, { nullable: false })
  data!: PostCreateInput;
}
