import * as TypeGraphQL from "type-graphql";
import { CategoryCreateInput } from "../../../inputs/CategoryCreateInput";
import { CategoryUpdateInput } from "../../../inputs/CategoryUpdateInput";
import { CategoryWhereUniqueInput } from "../../../inputs/CategoryWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertOneCategoryArgs {
  @TypeGraphQL.Field(_type => CategoryWhereUniqueInput, { nullable: false })
  where!: CategoryWhereUniqueInput;

  @TypeGraphQL.Field(_type => CategoryCreateInput, { nullable: false })
  create!: CategoryCreateInput;

  @TypeGraphQL.Field(_type => CategoryUpdateInput, { nullable: false })
  update!: CategoryUpdateInput;
}
