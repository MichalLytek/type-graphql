import * as TypeGraphQL from "type-graphql";
import { PatientWhereInput } from "../../../inputs/PatientWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyPatientArgs {
  @TypeGraphQL.Field(_type => PatientWhereInput, { nullable: true })
  where?: PatientWhereInput | null;
}
