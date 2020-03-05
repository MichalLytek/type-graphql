import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { CategoryCreateInput } from "../../../inputs/CategoryCreateInput";
import { CategoryUpdateInput } from "../../../inputs/CategoryUpdateInput";
import { CategoryWhereUniqueInput } from "../../../inputs/CategoryWhereUniqueInput";

@ArgsType()
export class UpsertOneCategoryArgs {
  @Field(_type => CategoryWhereUniqueInput, { nullable: false })
  where!: CategoryWhereUniqueInput;

  @Field(_type => CategoryCreateInput, { nullable: false })
  create!: CategoryCreateInput;

  @Field(_type => CategoryUpdateInput, { nullable: false })
  update!: CategoryUpdateInput;
}
