import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DirectorWhereInput } from "../../../inputs/DirectorWhereInput";

@ArgsType()
export class DeleteManyDirectorArgs {
  @Field(_type => DirectorWhereInput, { nullable: true })
  where?: DirectorWhereInput | null;
}
