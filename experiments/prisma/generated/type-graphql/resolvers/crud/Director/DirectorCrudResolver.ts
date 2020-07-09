import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateDirectorArgs } from "./args/AggregateDirectorArgs";
import { CreateDirectorArgs } from "./args/CreateDirectorArgs";
import { DeleteDirectorArgs } from "./args/DeleteDirectorArgs";
import { DeleteManyDirectorArgs } from "./args/DeleteManyDirectorArgs";
import { FindManyDirectorArgs } from "./args/FindManyDirectorArgs";
import { FindOneDirectorArgs } from "./args/FindOneDirectorArgs";
import { UpdateDirectorArgs } from "./args/UpdateDirectorArgs";
import { UpdateManyDirectorArgs } from "./args/UpdateManyDirectorArgs";
import { UpsertDirectorArgs } from "./args/UpsertDirectorArgs";
import { Director } from "../../../models/Director";
import { AggregateDirector } from "../../outputs/AggregateDirector";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Director)
export class DirectorCrudResolver {
  @TypeGraphQL.Query(_returns => Director, {
    nullable: true,
    description: undefined
  })
  async director(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOneDirectorArgs): Promise<Director | undefined> {
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
  async createDirector(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateDirectorArgs): Promise<Director> {
    return ctx.prisma.director.create(args);
  }

  @TypeGraphQL.Mutation(_returns => Director, {
    nullable: true,
    description: undefined
  })
  async deleteDirector(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteDirectorArgs): Promise<Director | undefined> {
    return ctx.prisma.director.delete(args);
  }

  @TypeGraphQL.Mutation(_returns => Director, {
    nullable: true,
    description: undefined
  })
  async updateDirector(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateDirectorArgs): Promise<Director | undefined> {
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
  async upsertDirector(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertDirectorArgs): Promise<Director> {
    return ctx.prisma.director.upsert(args);
  }

  @TypeGraphQL.Query(_returns => AggregateDirector, {
    nullable: false,
    description: undefined
  })
  async aggregateDirector(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateDirectorArgs): Promise<AggregateDirector> {
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

    return ctx.prisma.director.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
