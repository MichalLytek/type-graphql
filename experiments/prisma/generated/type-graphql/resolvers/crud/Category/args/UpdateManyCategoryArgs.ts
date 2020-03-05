import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { CategoryUpdateManyMutationInput } from "../../../inputs/CategoryUpdateManyMutationInput";
import { CategoryWhereInput } from "../../../inputs/CategoryWhereInput";

@ArgsType()
export class UpdateManyCategoryArgs {
  @Field(_type => CategoryUpdateManyMutationInput, { nullable: false })
  data!: CategoryUpdateManyMutationInput;

  @Field(_type => CategoryWhereInput, { nullable: true })
  where?: CategoryWhereInput | null;
}
