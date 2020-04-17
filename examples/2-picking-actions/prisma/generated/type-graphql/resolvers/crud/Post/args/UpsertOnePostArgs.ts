import * as TypeGraphQL from "type-graphql";
import { PostCreateInput } from "../../../inputs/PostCreateInput";
import { PostUpdateInput } from "../../../inputs/PostUpdateInput";
import { PostWhereUniqueInput } from "../../../inputs/PostWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertOnePostArgs {
  @TypeGraphQL.Field(_type => PostWhereUniqueInput, { nullable: false })
  where!: PostWhereUniqueInput;

  @TypeGraphQL.Field(_type => PostCreateInput, { nullable: false })
  create!: PostCreateInput;

  @TypeGraphQL.Field(_type => PostUpdateInput, { nullable: false })
  update!: PostUpdateInput;
}
