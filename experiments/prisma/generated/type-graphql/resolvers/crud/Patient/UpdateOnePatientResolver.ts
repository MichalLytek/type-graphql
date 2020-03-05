import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { UpdateOnePatientArgs } from "./args/UpdateOnePatientArgs";
import { Patient } from "../../../models/Patient";

@Resolver(_of => Patient)
export class UpdateOnePatientResolver {
  @Mutation(_returns => Patient, {
    nullable: true,
    description: undefined
  })
  async updateOnePatient(@Ctx() ctx: any, @Args() args: UpdateOnePatientArgs): Promise<Patient | null> {
    return ctx.prisma.patient.update(args);
  }
}
