import * as TypeGraphQL from "type-graphql";
import { PatientUpdateInput } from "../../../inputs/PatientUpdateInput";
import { PatientWhereUniqueInput } from "../../../inputs/PatientWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateOnePatientArgs {
  @TypeGraphQL.Field(_type => PatientUpdateInput, { nullable: false })
  data!: PatientUpdateInput;

  @TypeGraphQL.Field(_type => PatientWhereUniqueInput, { nullable: false })
  where!: PatientWhereUniqueInput;
}
