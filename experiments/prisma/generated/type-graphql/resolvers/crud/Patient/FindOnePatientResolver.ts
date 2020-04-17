import * as TypeGraphQL from "type-graphql";
import { FindOnePatientArgs } from "./args/FindOnePatientArgs";
import { Patient } from "../../../models/Patient";

@TypeGraphQL.Resolver(_of => Patient)
export class FindOnePatientResolver {
  @TypeGraphQL.Query(_returns => Patient, {
    nullable: true,
    description: undefined
  })
  async patient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOnePatientArgs): Promise<Patient | null> {
    return ctx.prisma.patient.findOne(args);
  }
}
