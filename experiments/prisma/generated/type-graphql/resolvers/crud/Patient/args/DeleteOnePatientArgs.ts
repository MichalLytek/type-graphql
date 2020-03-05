import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { PatientWhereUniqueInput } from "../../../inputs/PatientWhereUniqueInput";

@ArgsType()
export class DeleteOnePatientArgs {
  @Field(_type => PatientWhereUniqueInput, { nullable: false })
  where!: PatientWhereUniqueInput;
}
