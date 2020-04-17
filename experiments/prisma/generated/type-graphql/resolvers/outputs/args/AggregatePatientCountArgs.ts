import * as TypeGraphQL from "type-graphql";
import { PatientOrderByInput } from "../../inputs/PatientOrderByInput";
import { PatientWhereInput } from "../../inputs/PatientWhereInput";
import { PatientWhereUniqueInput } from "../../inputs/PatientWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregatePatientCountArgs {
  @TypeGraphQL.Field(_type => PatientWhereInput, { nullable: true })
  where?: PatientWhereInput | null;

  @TypeGraphQL.Field(_type => PatientOrderByInput, { nullable: true })
  orderBy?: PatientOrderByInput | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  skip?: number | null;

  @TypeGraphQL.Field(_type => PatientWhereUniqueInput, { nullable: true })
  after?: PatientWhereUniqueInput | null;

  @TypeGraphQL.Field(_type => PatientWhereUniqueInput, { nullable: true })
  before?: PatientWhereUniqueInput | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  first?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  last?: number | null;
}
