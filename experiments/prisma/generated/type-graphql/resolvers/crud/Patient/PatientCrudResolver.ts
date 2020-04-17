import * as TypeGraphQL from "type-graphql";
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

@TypeGraphQL.Resolver(_of => Patient)
export class PatientCrudResolver {
  @TypeGraphQL.Query(_returns => Patient, {
    nullable: true,
    description: undefined
  })
  async patient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOnePatientArgs): Promise<Patient | null> {
    return ctx.prisma.patient.findOne(args);
  }

  @TypeGraphQL.Query(_returns => [Patient], {
    nullable: false,
    description: undefined
  })
  async patients(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindManyPatientArgs): Promise<Patient[]> {
    return ctx.prisma.patient.findMany(args);
  }

  @TypeGraphQL.Mutation(_returns => Patient, {
    nullable: false,
    description: undefined
  })
  async createOnePatient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateOnePatientArgs): Promise<Patient> {
    return ctx.prisma.patient.create(args);
  }

  @TypeGraphQL.Mutation(_returns => Patient, {
    nullable: true,
    description: undefined
  })
  async deleteOnePatient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteOnePatientArgs): Promise<Patient | null> {
    return ctx.prisma.patient.delete(args);
  }

  @TypeGraphQL.Mutation(_returns => Patient, {
    nullable: true,
    description: undefined
  })
  async updateOnePatient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateOnePatientArgs): Promise<Patient | null> {
    return ctx.prisma.patient.update(args);
  }

  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyPatient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteManyPatientArgs): Promise<BatchPayload> {
    return ctx.prisma.patient.deleteMany(args);
  }

  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyPatient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateManyPatientArgs): Promise<BatchPayload> {
    return ctx.prisma.patient.updateMany(args);
  }

  @TypeGraphQL.Mutation(_returns => Patient, {
    nullable: false,
    description: undefined
  })
  async upsertOnePatient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertOnePatientArgs): Promise<Patient> {
    return ctx.prisma.patient.upsert(args);
  }

  @TypeGraphQL.Query(_returns => AggregatePatient, {
    nullable: false,
    description: undefined
  })
  async aggregatePatient(): Promise<AggregatePatient> {
    return new AggregatePatient();
  }
}
