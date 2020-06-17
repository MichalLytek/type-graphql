import * as TypeGraphQL from "type-graphql";
import { DeletePatientArgs } from "./args/DeletePatientArgs";
import { Patient } from "../../../models/Patient";

@TypeGraphQL.Resolver(_of => Patient)
export class DeletePatientResolver {
  @TypeGraphQL.Mutation(_returns => Patient, {
    nullable: true,
    description: undefined
  })
  async deletePatient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeletePatientArgs): Promise<Patient | undefined> {
    return ctx.prisma.patient.delete(args);
  }
}
