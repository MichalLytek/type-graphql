import * as TypeGraphQL from "type-graphql";
import { FindFirstPatientArgs } from "./args/FindFirstPatientArgs";
import { Patient } from "../../../models/Patient";

@TypeGraphQL.Resolver(_of => Patient)
export class FindFirstPatientResolver {
  @TypeGraphQL.Query(_returns => Patient, {
    nullable: true,
    description: undefined
  })
  async findFirstPatient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindFirstPatientArgs): Promise<Patient | null> {
    return ctx.prisma.patient.findFirst(args);
  }
}
