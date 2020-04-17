import * as TypeGraphQL from "type-graphql";
import { DeleteManyPatientArgs } from "./args/DeleteManyPatientArgs";
import { Patient } from "../../../models/Patient";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Patient)
export class DeleteManyPatientResolver {
  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyPatient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteManyPatientArgs): Promise<BatchPayload> {
    return ctx.prisma.patient.deleteMany(args);
  }
}
