import * as TypeGraphQL from "type-graphql";
import { CreateOneDirectorArgs } from "./args/CreateOneDirectorArgs";
import { DeleteManyDirectorArgs } from "./args/DeleteManyDirectorArgs";
import { DeleteOneDirectorArgs } from "./args/DeleteOneDirectorArgs";
import { FindManyDirectorArgs } from "./args/FindManyDirectorArgs";
import { FindOneDirectorArgs } from "./args/FindOneDirectorArgs";
import { UpdateManyDirectorArgs } from "./args/UpdateManyDirectorArgs";
import { UpdateOneDirectorArgs } from "./args/UpdateOneDirectorArgs";
import { UpsertOneDirectorArgs } from "./args/UpsertOneDirectorArgs";
import { Director } from "../../../models/Director";
import { AggregateDirector } from "../../outputs/AggregateDirector";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Director)
export class DirectorCrudResolver {
  @TypeGraphQL.Query(_returns => Director, {
    nullable: true,
    description: undefined
  })
  async director(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOneDirectorArgs): Promise<Director | null> {
    return ctx.prisma.director.findOne(args);
  }

  @TypeGraphQL.Query(_returns => [Director], {
    nullable: false,
    description: undefined
  })
  async directors(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindManyDirectorArgs): Promise<Director[]> {
    return ctx.prisma.director.findMany(args);
  }

  @TypeGraphQL.Mutation(_returns => Director, {
    nullable: false,
    description: undefined
  })
  async createOneDirector(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateOneDirectorArgs): Promise<Director> {
    return ctx.prisma.director.create(args);
  }

  @TypeGraphQL.Mutation(_returns => Director, {
    nullable: true,
    description: undefined
  })
  async deleteOneDirector(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteOneDirectorArgs): Promise<Director | null> {
    return ctx.prisma.director.delete(args);
  }

  @TypeGraphQL.Mutation(_returns => Director, {
    nullable: true,
    description: undefined
  })
  async updateOneDirector(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateOneDirectorArgs): Promise<Director | null> {
    return ctx.prisma.director.update(args);
  }

  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyDirector(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteManyDirectorArgs): Promise<BatchPayload> {
    return ctx.prisma.director.deleteMany(args);
  }

  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyDirector(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateManyDirectorArgs): Promise<BatchPayload> {
    return ctx.prisma.director.updateMany(args);
  }

  @TypeGraphQL.Mutation(_returns => Director, {
    nullable: false,
    description: undefined
  })
  async upsertOneDirector(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertOneDirectorArgs): Promise<Director> {
    return ctx.prisma.director.upsert(args);
  }

  @TypeGraphQL.Query(_returns => AggregateDirector, {
    nullable: false,
    description: undefined
  })
  async aggregateDirector(): Promise<AggregateDirector> {
    return new AggregateDirector();
  }
}
