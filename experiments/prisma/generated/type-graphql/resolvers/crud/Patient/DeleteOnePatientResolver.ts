import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DeleteOnePatientArgs } from "./args/DeleteOnePatientArgs";
import { Patient } from "../../../models/Patient";

@Resolver(_of => Patient)
export class DeleteOnePatientResolver {
  @Mutation(_returns => Patient, {
    nullable: true,
    description: undefined
  })
  async deleteOnePatient(@Ctx() ctx: any, @Args() args: DeleteOnePatientArgs): Promise<Patient | null> {
    return ctx.prisma.patient.delete(args);
  }
}
