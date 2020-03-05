import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { PatientCreateInput } from "../../../inputs/PatientCreateInput";

@ArgsType()
export class CreateOnePatientArgs {
  @Field(_type => PatientCreateInput, { nullable: false })
  data!: PatientCreateInput;
}
