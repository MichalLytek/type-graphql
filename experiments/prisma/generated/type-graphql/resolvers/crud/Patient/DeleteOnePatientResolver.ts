import * as TypeGraphQL from "type-graphql";
import { DeleteOnePatientArgs } from "./args/DeleteOnePatientArgs";
import { Patient } from "../../../models/Patient";

@TypeGraphQL.Resolver(_of => Patient)
export class DeleteOnePatientResolver {
  @TypeGraphQL.Mutation(_returns => Patient, {
    nullable: true,
    description: undefined
  })
  async deleteOnePatient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteOnePatientArgs): Promise<Patient | null> {
    return ctx.prisma.patient.delete(args);
  }
}
