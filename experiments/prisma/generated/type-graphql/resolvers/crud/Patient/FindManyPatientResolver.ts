import * as TypeGraphQL from "type-graphql";
import { FindManyPatientArgs } from "./args/FindManyPatientArgs";
import { Patient } from "../../../models/Patient";

@TypeGraphQL.Resolver(_of => Patient)
export class FindManyPatientResolver {
  @TypeGraphQL.Query(_returns => [Patient], {
    nullable: false,
    description: undefined
  })
  async patients(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindManyPatientArgs): Promise<Patient[]> {
    return ctx.prisma.patient.findMany(args);
  }
}
