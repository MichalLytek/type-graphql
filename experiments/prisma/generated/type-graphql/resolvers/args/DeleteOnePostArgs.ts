import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";
import { PostWhereUniqueInput } from "../../inputs/PostWhereUniqueInput";

@ArgsType()
export class DeleteOnePostArgs {
  @Field(_type => PostWhereUniqueInput, { nullable: false })
  where!: PostWhereUniqueInput;
}
