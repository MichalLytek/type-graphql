import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";
import { UserWhereUniqueInput } from "../../inputs/UserWhereUniqueInput";

@ArgsType()
export class FindOneUserArgs {
  @Field(_type => UserWhereUniqueInput, { nullable: false })
  where!: UserWhereUniqueInput;
}
