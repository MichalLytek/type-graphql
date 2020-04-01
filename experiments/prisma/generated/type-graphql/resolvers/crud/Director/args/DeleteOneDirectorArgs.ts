import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DirectorWhereUniqueInput } from "../../../inputs/DirectorWhereUniqueInput";

@ArgsType()
export class DeleteOneDirectorArgs {
  @Field(_type => DirectorWhereUniqueInput, { nullable: false })
  where!: DirectorWhereUniqueInput;
}
