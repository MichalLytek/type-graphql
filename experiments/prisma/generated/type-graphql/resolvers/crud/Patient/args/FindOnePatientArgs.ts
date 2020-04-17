import * as TypeGraphQL from "type-graphql";
import { PatientWhereUniqueInput } from "../../../inputs/PatientWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindOnePatientArgs {
  @TypeGraphQL.Field(_type => PatientWhereUniqueInput, { nullable: false })
  where!: PatientWhereUniqueInput;
}
