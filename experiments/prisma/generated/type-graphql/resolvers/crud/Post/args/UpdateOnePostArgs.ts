import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { PostUpdateInput } from "../../../inputs/PostUpdateInput";
import { PostWhereUniqueInput } from "../../../inputs/PostWhereUniqueInput";

@ArgsType()
export class UpdateOnePostArgs {
  @Field(_type => PostUpdateInput, { nullable: false })
  data!: PostUpdateInput;

  @Field(_type => PostWhereUniqueInput, { nullable: false })
  where!: PostWhereUniqueInput;
}
