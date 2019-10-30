import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";
import { PostCreateInput } from "../inputs/PostCreateInput";

@ArgsType()
export class CreateOnePostArgs {
  @Field(_type => PostCreateInput, { nullable: false })
  data!: PostCreateInput;
}
