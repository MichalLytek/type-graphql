import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregatePatientArgs } from "./args/AggregatePatientArgs";
import { CreatePatientArgs } from "./args/CreatePatientArgs";
import { DeleteManyPatientArgs } from "./args/DeleteManyPatientArgs";
import { DeletePatientArgs } from "./args/DeletePatientArgs";
import { FindManyPatientArgs } from "./args/FindManyPatientArgs";
import { FindOnePatientArgs } from "./args/FindOnePatientArgs";
import { UpdateManyPatientArgs } from "./args/UpdateManyPatientArgs";
import { UpdatePatientArgs } from "./args/UpdatePatientArgs";
import { UpsertPatientArgs } from "./args/UpsertPatientArgs";
import { Patient } from "../../../models/Patient";
import { AggregatePatient } from "../../outputs/AggregatePatient";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Patient)
export class PatientCrudResolver {
  @TypeGraphQL.Query(_returns => Patient, {
    nullable: true,
    description: undefined
  })
  async patient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOnePatientArgs): Promise<Patient | undefined> {
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
  async createPatient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreatePatientArgs): Promise<Patient> {
    return ctx.prisma.patient.create(args);
  }

  @TypeGraphQL.Mutation(_returns => Patient, {
    nullable: true,
    description: undefined
  })
  async deletePatient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeletePatientArgs): Promise<Patient | undefined> {
    return ctx.prisma.patient.delete(args);
  }

  @TypeGraphQL.Mutation(_returns => Patient, {
    nullable: true,
    description: undefined
  })
  async updatePatient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdatePatientArgs): Promise<Patient | undefined> {
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
  async upsertPatient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertPatientArgs): Promise<Patient> {
    return ctx.prisma.patient.upsert(args);
  }

  @TypeGraphQL.Query(_returns => AggregatePatient, {
    nullable: false,
    description: undefined
  })
  async aggregatePatient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregatePatientArgs): Promise<AggregatePatient> {
    function transformFields(fields: Record<string, any>): Record<string, any> {
      return Object.fromEntries(
        Object.entries(fields).map<[string, any]>(([key, value]) => {
          if (Object.keys(value).length === 0) {
            return [key, true];
          }
          return [key, transformFields(value)];
        })
      );
    }

    return ctx.prisma.patient.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
