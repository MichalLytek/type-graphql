import * as TypeGraphQL from "type-graphql";
import { UpsertPatientArgs } from "./args/UpsertPatientArgs";
import { Patient } from "../../../models/Patient";

@TypeGraphQL.Resolver(_of => Patient)
export class UpsertPatientResolver {
  @TypeGraphQL.Mutation(_returns => Patient, {
    nullable: false,
    description: undefined
  })
  async upsertPatient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertPatientArgs): Promise<Patient> {
    return ctx.prisma.patient.upsert(args);
  }
}
