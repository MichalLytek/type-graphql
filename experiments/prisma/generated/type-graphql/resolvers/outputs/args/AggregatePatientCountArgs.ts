import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { PatientOrderByInput } from "../../inputs/PatientOrderByInput";
import { PatientWhereInput } from "../../inputs/PatientWhereInput";
import { PatientWhereUniqueInput } from "../../inputs/PatientWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregatePatientCountArgs {
  @TypeGraphQL.Field(_type => PatientWhereInput, { nullable: true })
  where?: PatientWhereInput | null | undefined;

  @TypeGraphQL.Field(_type => PatientOrderByInput, { nullable: true })
  orderBy?: PatientOrderByInput | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  skip?: number | null | undefined;

  @TypeGraphQL.Field(_type => PatientWhereUniqueInput, { nullable: true })
  after?: PatientWhereUniqueInput | null | undefined;

  @TypeGraphQL.Field(_type => PatientWhereUniqueInput, { nullable: true })
  before?: PatientWhereUniqueInput | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  first?: number | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  last?: number | null | undefined;
}
