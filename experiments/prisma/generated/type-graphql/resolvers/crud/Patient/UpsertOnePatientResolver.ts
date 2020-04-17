import * as TypeGraphQL from "type-graphql";
import { UpsertOnePatientArgs } from "./args/UpsertOnePatientArgs";
import { Patient } from "../../../models/Patient";

@TypeGraphQL.Resolver(_of => Patient)
export class UpsertOnePatientResolver {
  @TypeGraphQL.Mutation(_returns => Patient, {
    nullable: false,
    description: undefined
  })
  async upsertOnePatient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertOnePatientArgs): Promise<Patient> {
    return ctx.prisma.patient.upsert(args);
  }
}
