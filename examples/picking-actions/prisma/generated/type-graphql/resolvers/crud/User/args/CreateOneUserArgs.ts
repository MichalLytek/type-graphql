import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { UserCreateInput } from "../../../inputs/UserCreateInput";

@ArgsType()
export class CreateOneUserArgs {
  @Field(_type => UserCreateInput, { nullable: false })
  data!: UserCreateInput;
}
