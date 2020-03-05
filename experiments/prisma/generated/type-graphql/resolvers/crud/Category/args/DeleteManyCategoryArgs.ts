import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { CategoryWhereInput } from "../../../inputs/CategoryWhereInput";

@ArgsType()
export class DeleteManyCategoryArgs {
  @Field(_type => CategoryWhereInput, { nullable: true })
  where?: CategoryWhereInput | null;
}
