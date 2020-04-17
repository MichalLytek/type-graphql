import * as TypeGraphQL from "type-graphql";
import { PostWhereInput } from "../../../inputs/PostWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyPostArgs {
  @TypeGraphQL.Field(_type => PostWhereInput, { nullable: true })
  where?: PostWhereInput | null;
}
