import * as TypeGraphQL from "type-graphql";
import { CategoryCreateInput } from "../../../inputs/CategoryCreateInput";

@TypeGraphQL.ArgsType()
export class CreateOneCategoryArgs {
  @TypeGraphQL.Field(_type => CategoryCreateInput, { nullable: false })
  data!: CategoryCreateInput;
}
