import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { PostCreateInput } from "../../../inputs/PostCreateInput";

@ArgsType()
export class CreateOnePostArgs {
  @Field(_type => PostCreateInput, { nullable: false })
  data!: PostCreateInput;
}
