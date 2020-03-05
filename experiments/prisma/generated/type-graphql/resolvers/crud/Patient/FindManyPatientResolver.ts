import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { FindManyPatientArgs } from "./args/FindManyPatientArgs";
import { Patient } from "../../../models/Patient";

@Resolver(_of => Patient)
export class FindManyPatientResolver {
  @Query(_returns => [Patient], {
    nullable: false,
    description: undefined
  })
  async patients(@Ctx() ctx: any, @Args() args: FindManyPatientArgs): Promise<Patient[]> {
    return ctx.prisma.patient.findMany(args);
  }
}
