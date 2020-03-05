import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { UpdateManyPatientArgs } from "./args/UpdateManyPatientArgs";
import { Patient } from "../../../models/Patient";
import { BatchPayload } from "../../outputs/BatchPayload";

@Resolver(_of => Patient)
export class UpdateManyPatientResolver {
  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyPatient(@Ctx() ctx: any, @Args() args: UpdateManyPatientArgs): Promise<BatchPayload> {
    return ctx.prisma.patient.updateMany(args);
  }
}
