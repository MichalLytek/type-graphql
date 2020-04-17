import * as TypeGraphQL from "type-graphql";
import { CategoryWhereUniqueInput } from "../../../inputs/CategoryWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteOneCategoryArgs {
  @TypeGraphQL.Field(_type => CategoryWhereUniqueInput, { nullable: false })
  where!: CategoryWhereUniqueInput;
}
