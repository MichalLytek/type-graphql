import * as TypeGraphQL from "type-graphql";
import { PatientCreateInput } from "../../../inputs/PatientCreateInput";

@TypeGraphQL.ArgsType()
export class CreateOnePatientArgs {
  @TypeGraphQL.Field(_type => PatientCreateInput, { nullable: false })
  data!: PatientCreateInput;
}
