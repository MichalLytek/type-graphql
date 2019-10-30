import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";
import { PostUpdateManyMutationInput } from "../../../inputs/PostUpdateManyMutationInput";
import { PostWhereInput } from "../../../inputs/PostWhereInput";

@ArgsType()
export class UpdateManyPostArgs {
  @Field(_type => PostUpdateManyMutationInput, { nullable: false })
  data!: PostUpdateManyMutationInput;

  @Field(_type => PostWhereInput, { nullable: true })
  where?: PostWhereInput | null;
}
