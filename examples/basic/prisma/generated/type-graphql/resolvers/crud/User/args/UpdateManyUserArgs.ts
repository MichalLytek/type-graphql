import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";
import { UserUpdateManyMutationInput } from "../../../inputs/UserUpdateManyMutationInput";
import { UserWhereInput } from "../../../inputs/UserWhereInput";

@ArgsType()
export class UpdateManyUserArgs {
  @Field(_type => UserUpdateManyMutationInput, { nullable: false })
  data!: UserUpdateManyMutationInput;

  @Field(_type => UserWhereInput, { nullable: true })
  where?: UserWhereInput | null;
}
