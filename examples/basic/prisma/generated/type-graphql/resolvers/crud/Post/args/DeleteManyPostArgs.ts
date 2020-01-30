import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { PostWhereInput } from "../../../inputs/PostWhereInput";

@ArgsType()
export class DeleteManyPostArgs {
  @Field(_type => PostWhereInput, { nullable: true })
  where?: PostWhereInput | null;
}
