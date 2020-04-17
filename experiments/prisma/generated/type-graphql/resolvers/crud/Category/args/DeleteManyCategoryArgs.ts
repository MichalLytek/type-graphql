import * as TypeGraphQL from "type-graphql";
import { CategoryWhereInput } from "../../../inputs/CategoryWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyCategoryArgs {
  @TypeGraphQL.Field(_type => CategoryWhereInput, { nullable: true })
  where?: CategoryWhereInput | null;
}
