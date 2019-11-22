import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { PostUpdateManyMutationInput } from "../../../inputs/PostUpdateManyMutationInput";
import { PostWhereInput } from "../../../inputs/PostWhereInput";

@ArgsType()
export class UpdateManyPostArgs {
  @Field(_type => PostUpdateManyMutationInput, { nullable: false })
  data!: PostUpdateManyMutationInput;

  @Field(_type => PostWhereInput, { nullable: true })
  where?: PostWhereInput | null;
}
