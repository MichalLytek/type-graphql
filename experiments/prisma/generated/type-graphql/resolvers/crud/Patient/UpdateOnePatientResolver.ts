import * as TypeGraphQL from "type-graphql";
import { UpdateOnePatientArgs } from "./args/UpdateOnePatientArgs";
import { Patient } from "../../../models/Patient";

@TypeGraphQL.Resolver(_of => Patient)
export class UpdateOnePatientResolver {
  @TypeGraphQL.Mutation(_returns => Patient, {
    nullable: true,
    description: undefined
  })
  async updateOnePatient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateOnePatientArgs): Promise<Patient | null> {
    return ctx.prisma.patient.update(args);
  }
}
