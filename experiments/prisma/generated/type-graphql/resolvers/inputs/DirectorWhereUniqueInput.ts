import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { FirstNameLastNameCompoundUniqueInput } from "../inputs/FirstNameLastNameCompoundUniqueInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class DirectorWhereUniqueInput {
  @Field(_type => FirstNameLastNameCompoundUniqueInput, {
    nullable: true,
    description: undefined
  })
  firstName_lastName?: FirstNameLastNameCompoundUniqueInput | null;
}
