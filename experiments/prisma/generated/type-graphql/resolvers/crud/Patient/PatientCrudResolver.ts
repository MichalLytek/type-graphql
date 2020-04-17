import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { CreateOnePatientArgs } from "./args/CreateOnePatientArgs";
import { DeleteManyPatientArgs } from "./args/DeleteManyPatientArgs";
import { DeleteOnePatientArgs } from "./args/DeleteOnePatientArgs";
import { FindManyPatientArgs } from "./args/FindManyPatientArgs";
import { FindOnePatientArgs } from "./args/FindOnePatientArgs";
import { UpdateManyPatientArgs } from "./args/UpdateManyPatientArgs";
import { UpdateOnePatientArgs } from "./args/UpdateOnePatientArgs";
import { UpsertOnePatientArgs } from "./args/UpsertOnePatientArgs";
import { Patient } from "../../../models/Patient";
import { AggregatePatient } from "../../outputs/AggregatePatient";
import { BatchPayload } from "../../outputs/BatchPayload";

@Resolver(_of => Patient)
export class PatientCrudResolver {
  @Query(_returns => Patient, {
    nullable: true,
    description: undefined
  })
  async patient(@Ctx() ctx: any, @Args() args: FindOnePatientArgs): Promise<Patient | null> {
    return ctx.prisma.patient.findOne(args);
  }

  @Query(_returns => [Patient], {
    nullable: false,
    description: undefined
  })
  async patients(@Ctx() ctx: any, @Args() args: FindManyPatientArgs): Promise<Patient[]> {
    return ctx.prisma.patient.findMany(args);
  }

  @Mutation(_returns => Patient, {
    nullable: false,
    description: undefined
  })
  async createOnePatient(@Ctx() ctx: any, @Args() args: CreateOnePatientArgs): Promise<Patient> {
    return ctx.prisma.patient.create(args);
  }

  @Mutation(_returns => Patient, {
    nullable: true,
    description: undefined
  })
  async deleteOnePatient(@Ctx() ctx: any, @Args() args: DeleteOnePatientArgs): Promise<Patient | null> {
    return ctx.prisma.patient.delete(args);
  }

  @Mutation(_returns => Patient, {
    nullable: true,
    description: undefined
  })
  async updateOnePatient(@Ctx() ctx: any, @Args() args: UpdateOnePatientArgs): Promise<Patient | null> {
    return ctx.prisma.patient.update(args);
  }

  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyPatient(@Ctx() ctx: any, @Args() args: DeleteManyPatientArgs): Promise<BatchPayload> {
    return ctx.prisma.patient.deleteMany(args);
  }

  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyPatient(@Ctx() ctx: any, @Args() args: UpdateManyPatientArgs): Promise<BatchPayload> {
    return ctx.prisma.patient.updateMany(args);
  }

  @Mutation(_returns => Patient, {
    nullable: false,
    description: undefined
  })
  async upsertOnePatient(@Ctx() ctx: any, @Args() args: UpsertOnePatientArgs): Promise<Patient> {
    return ctx.prisma.patient.upsert(args);
  }

  @Query(_returns => AggregatePatient, {
    nullable: false,
    description: undefined
  })
  async aggregatePatient(): Promise<AggregatePatient> {
    return new AggregatePatient();
  }
}
