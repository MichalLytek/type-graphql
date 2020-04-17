import * as TypeGraphQL from "type-graphql";
import { Patient } from "../../../models/Patient";
import { AggregatePatient } from "../../outputs/AggregatePatient";

@TypeGraphQL.Resolver(_of => Patient)
export class AggregatePatientResolver {
  @TypeGraphQL.Query(_returns => AggregatePatient, {
    nullable: false,
    description: undefined
  })
  async aggregatePatient(): Promise<AggregatePatient> {
    return new AggregatePatient();
  }
}
