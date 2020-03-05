import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DeleteManyPatientArgs } from "./args/DeleteManyPatientArgs";
import { Patient } from "../../../models/Patient";
import { BatchPayload } from "../../outputs/BatchPayload";

@Resolver(_of => Patient)
export class DeleteManyPatientResolver {
  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyPatient(@Ctx() ctx: any, @Args() args: DeleteManyPatientArgs): Promise<BatchPayload> {
    return ctx.prisma.patient.deleteMany(args);
  }
}
