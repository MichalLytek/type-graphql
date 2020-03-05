import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { CategoryCreateInput } from "../../../inputs/CategoryCreateInput";

@ArgsType()
export class CreateOneCategoryArgs {
  @Field(_type => CategoryCreateInput, { nullable: false })
  data!: CategoryCreateInput;
}
