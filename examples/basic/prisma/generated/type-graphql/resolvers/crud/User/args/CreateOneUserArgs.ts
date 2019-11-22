import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";
import { UserCreateInput } from "../../../inputs/UserCreateInput";

@ArgsType()
export class CreateOneUserArgs {
  @Field(_type => UserCreateInput, { nullable: false })
  data!: UserCreateInput;
}
