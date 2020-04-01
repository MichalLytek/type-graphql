import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DirectorUpdateManyMutationInput } from "../../../inputs/DirectorUpdateManyMutationInput";
import { DirectorWhereInput } from "../../../inputs/DirectorWhereInput";

@ArgsType()
export class UpdateManyDirectorArgs {
  @Field(_type => DirectorUpdateManyMutationInput, { nullable: false })
  data!: DirectorUpdateManyMutationInput;

  @Field(_type => DirectorWhereInput, { nullable: true })
  where?: DirectorWhereInput | null;
}
