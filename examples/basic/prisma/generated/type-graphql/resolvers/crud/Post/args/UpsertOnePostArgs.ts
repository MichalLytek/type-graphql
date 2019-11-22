import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { PostCreateInput } from "../../../inputs/PostCreateInput";
import { PostUpdateInput } from "../../../inputs/PostUpdateInput";
import { PostWhereUniqueInput } from "../../../inputs/PostWhereUniqueInput";

@ArgsType()
export class UpsertOnePostArgs {
  @Field(_type => PostWhereUniqueInput, { nullable: false })
  where!: PostWhereUniqueInput;

  @Field(_type => PostCreateInput, { nullable: false })
  create!: PostCreateInput;

  @Field(_type => PostUpdateInput, { nullable: false })
  update!: PostUpdateInput;
}
