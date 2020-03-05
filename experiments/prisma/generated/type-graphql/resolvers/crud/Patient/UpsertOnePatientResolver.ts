import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { UpsertOnePatientArgs } from "./args/UpsertOnePatientArgs";
import { Patient } from "../../../models/Patient";

@Resolver(_of => Patient)
export class UpsertOnePatientResolver {
  @Mutation(_returns => Patient, {
    nullable: false,
    description: undefined
  })
  async upsertOnePatient(@Ctx() ctx: any, @Args() args: UpsertOnePatientArgs): Promise<Patient> {
    return ctx.prisma.patient.upsert(args);
  }
}
