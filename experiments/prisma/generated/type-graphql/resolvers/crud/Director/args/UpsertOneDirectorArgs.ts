import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DirectorCreateInput } from "../../../inputs/DirectorCreateInput";
import { DirectorUpdateInput } from "../../../inputs/DirectorUpdateInput";
import { DirectorWhereUniqueInput } from "../../../inputs/DirectorWhereUniqueInput";

@ArgsType()
export class UpsertOneDirectorArgs {
  @Field(_type => DirectorWhereUniqueInput, { nullable: false })
  where!: DirectorWhereUniqueInput;

  @Field(_type => DirectorCreateInput, { nullable: false })
  create!: DirectorCreateInput;

  @Field(_type => DirectorUpdateInput, { nullable: false })
  update!: DirectorUpdateInput;
}
