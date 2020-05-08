import * as TypeGraphQL from "type-graphql";
import { PostCreateInput } from "../../../inputs/PostCreateInput";

@TypeGraphQL.ArgsType()
export class CreatePostArgs {
  @TypeGraphQL.Field(_type => PostCreateInput, { nullable: false })
  data!: PostCreateInput;
}
