import * as TypeGraphQL from "type-graphql";
import { PatientUpdateInput } from "../../../inputs/PatientUpdateInput";
import { PatientWhereUniqueInput } from "../../../inputs/PatientWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdatePatientArgs {
  @TypeGraphQL.Field(_type => PatientUpdateInput, { nullable: false })
  data!: PatientUpdateInput;

  @TypeGraphQL.Field(_type => PatientWhereUniqueInput, { nullable: false })
  where!: PatientWhereUniqueInput;
}
