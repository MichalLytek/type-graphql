import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { PatientOrderByInput } from "../../../inputs/PatientOrderByInput";
import { PatientWhereInput } from "../../../inputs/PatientWhereInput";
import { PatientWhereUniqueInput } from "../../../inputs/PatientWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregatePatientArgs {
  @TypeGraphQL.Field(_type => PatientWhereInput, { nullable: true })
  where?: PatientWhereInput | undefined;

  @TypeGraphQL.Field(_type => PatientOrderByInput, { nullable: true })
  orderBy?: PatientOrderByInput | undefined;

  @TypeGraphQL.Field(_type => PatientWhereUniqueInput, { nullable: true })
  cursor?: PatientWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  skip?: number | undefined;
}
