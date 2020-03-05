import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { FindOnePatientArgs } from "./args/FindOnePatientArgs";
import { Patient } from "../../../models/Patient";

@Resolver(_of => Patient)
export class FindOnePatientResolver {
  @Query(_returns => Patient, {
    nullable: true,
    description: undefined
  })
  async patient(@Ctx() ctx: any, @Args() args: FindOnePatientArgs): Promise<Patient | null> {
    return ctx.prisma.patient.findOne(args);
  }
}
