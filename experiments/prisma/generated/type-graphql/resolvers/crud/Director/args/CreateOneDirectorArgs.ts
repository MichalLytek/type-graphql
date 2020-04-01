import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DirectorCreateInput } from "../../../inputs/DirectorCreateInput";

@ArgsType()
export class CreateOneDirectorArgs {
  @Field(_type => DirectorCreateInput, { nullable: false })
  data!: DirectorCreateInput;
}
