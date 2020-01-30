import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { UserWhereInput } from "../../../inputs/UserWhereInput";

@ArgsType()
export class DeleteManyUserArgs {
  @Field(_type => UserWhereInput, { nullable: true })
  where?: UserWhereInput | null;
}
