import * as TypeGraphQL from "type-graphql";
import { CreateOnePatientArgs } from "./args/CreateOnePatientArgs";
import { Patient } from "../../../models/Patient";

@TypeGraphQL.Resolver(_of => Patient)
export class CreateOnePatientResolver {
  @TypeGraphQL.Mutation(_returns => Patient, {
    nullable: false,
    description: undefined
  })
  async createOnePatient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateOnePatientArgs): Promise<Patient> {
    return ctx.prisma.patient.create(args);
  }
}
