import * as TypeGraphQL from "type-graphql";
import { PostWhereUniqueInput } from "../../../inputs/PostWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindOnePostArgs {
  @TypeGraphQL.Field(_type => PostWhereUniqueInput, { nullable: false })
  where!: PostWhereUniqueInput;
}
