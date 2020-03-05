import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { PatientUpdateInput } from "../../../inputs/PatientUpdateInput";
import { PatientWhereUniqueInput } from "../../../inputs/PatientWhereUniqueInput";

@ArgsType()
export class UpdateOnePatientArgs {
  @Field(_type => PatientUpdateInput, { nullable: false })
  data!: PatientUpdateInput;

  @Field(_type => PatientWhereUniqueInput, { nullable: false })
  where!: PatientWhereUniqueInput;
}
