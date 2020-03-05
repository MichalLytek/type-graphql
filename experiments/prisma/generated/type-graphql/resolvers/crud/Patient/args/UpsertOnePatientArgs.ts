import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { PatientCreateInput } from "../../../inputs/PatientCreateInput";
import { PatientUpdateInput } from "../../../inputs/PatientUpdateInput";
import { PatientWhereUniqueInput } from "../../../inputs/PatientWhereUniqueInput";

@ArgsType()
export class UpsertOnePatientArgs {
  @Field(_type => PatientWhereUniqueInput, { nullable: false })
  where!: PatientWhereUniqueInput;

  @Field(_type => PatientCreateInput, { nullable: false })
  create!: PatientCreateInput;

  @Field(_type => PatientUpdateInput, { nullable: false })
  update!: PatientUpdateInput;
}
