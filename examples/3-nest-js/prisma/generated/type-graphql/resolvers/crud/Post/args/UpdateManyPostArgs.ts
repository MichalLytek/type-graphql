import * as TypeGraphQL from "type-graphql";
import { PostUpdateManyMutationInput } from "../../../inputs/PostUpdateManyMutationInput";
import { PostWhereInput } from "../../../inputs/PostWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyPostArgs {
  @TypeGraphQL.Field(_type => PostUpdateManyMutationInput, { nullable: false })
  data!: PostUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => PostWhereInput, { nullable: true })
  where?: PostWhereInput | null;
}
