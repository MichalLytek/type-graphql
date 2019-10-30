import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";
import { PostWhereUniqueInput } from "../inputs/PostWhereUniqueInput";
import { PostCreateInput } from "../inputs/PostCreateInput";
import { PostUpdateInput } from "../inputs/PostUpdateInput";

@ArgsType()
export class UpsertOnePostArgs {
  @Field(_type => PostWhereUniqueInput, { nullable: false })
  where!: PostWhereUniqueInput;

  @Field(_type => PostCreateInput, { nullable: false })
  create!: PostCreateInput;

  @Field(_type => PostUpdateInput, { nullable: false })
  update!: PostUpdateInput;
}
