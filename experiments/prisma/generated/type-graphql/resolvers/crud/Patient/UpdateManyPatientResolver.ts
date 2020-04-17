import * as TypeGraphQL from "type-graphql";
import { UpdateManyPatientArgs } from "./args/UpdateManyPatientArgs";
import { Patient } from "../../../models/Patient";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Patient)
export class UpdateManyPatientResolver {
  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyPatient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateManyPatientArgs): Promise<BatchPayload> {
    return ctx.prisma.patient.updateMany(args);
  }
}
