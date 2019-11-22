import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { UserUpdateManyMutationInput } from "../../../inputs/UserUpdateManyMutationInput";
import { UserWhereInput } from "../../../inputs/UserWhereInput";

@ArgsType()
export class UpdateManyUserArgs {
  @Field(_type => UserUpdateManyMutationInput, { nullable: false })
  data!: UserUpdateManyMutationInput;

  @Field(_type => UserWhereInput, { nullable: true })
  where?: UserWhereInput | null;
}
