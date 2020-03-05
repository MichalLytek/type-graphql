import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { CreateOnePatientArgs } from "./args/CreateOnePatientArgs";
import { Patient } from "../../../models/Patient";

@Resolver(_of => Patient)
export class CreateOnePatientResolver {
  @Mutation(_returns => Patient, {
    nullable: false,
    description: undefined
  })
  async createOnePatient(@Ctx() ctx: any, @Args() args: CreateOnePatientArgs): Promise<Patient> {
    return ctx.prisma.patient.create(args);
  }
}
