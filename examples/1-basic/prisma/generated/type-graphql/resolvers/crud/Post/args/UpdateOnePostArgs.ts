import * as TypeGraphQL from "type-graphql";
import { PostUpdateInput } from "../../../inputs/PostUpdateInput";
import { PostWhereUniqueInput } from "../../../inputs/PostWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateOnePostArgs {
  @TypeGraphQL.Field(_type => PostUpdateInput, { nullable: false })
  data!: PostUpdateInput;

  @TypeGraphQL.Field(_type => PostWhereUniqueInput, { nullable: false })
  where!: PostWhereUniqueInput;
}
