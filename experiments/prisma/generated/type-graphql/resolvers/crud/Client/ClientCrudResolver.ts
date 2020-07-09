import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateClientArgs } from "./args/AggregateClientArgs";
import { CreateClientArgs } from "./args/CreateClientArgs";
import { DeleteClientArgs } from "./args/DeleteClientArgs";
import { DeleteManyClientArgs } from "./args/DeleteManyClientArgs";
import { FindManyClientArgs } from "./args/FindManyClientArgs";
import { FindOneClientArgs } from "./args/FindOneClientArgs";
import { UpdateClientArgs } from "./args/UpdateClientArgs";
import { UpdateManyClientArgs } from "./args/UpdateManyClientArgs";
import { UpsertClientArgs } from "./args/UpsertClientArgs";
import { Client } from "../../../models/Client";
import { AggregateClient } from "../../outputs/AggregateClient";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Client)
export class ClientCrudResolver {
  @TypeGraphQL.Query(_returns => Client, {
    nullable: true,
    description: undefined
  })
  async client(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOneClientArgs): Promise<Client | undefined> {
    return ctx.prisma.user.findOne(args);
  }

  @TypeGraphQL.Query(_returns => [Client], {
    nullable: false,
    description: undefined
  })
  async clients(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindManyClientArgs): Promise<Client[]> {
    return ctx.prisma.user.findMany(args);
  }

  @TypeGraphQL.Mutation(_returns => Client, {
    nullable: false,
    description: undefined
  })
  async createClient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateClientArgs): Promise<Client> {
    return ctx.prisma.user.create(args);
  }

  @TypeGraphQL.Mutation(_returns => Client, {
    nullable: true,
    description: undefined
  })
  async deleteClient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteClientArgs): Promise<Client | undefined> {
    return ctx.prisma.user.delete(args);
  }

  @TypeGraphQL.Mutation(_returns => Client, {
    nullable: true,
    description: undefined
  })
  async updateClient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateClientArgs): Promise<Client | undefined> {
    return ctx.prisma.user.update(args);
  }

  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyClient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteManyClientArgs): Promise<BatchPayload> {
    return ctx.prisma.user.deleteMany(args);
  }

  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyClient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateManyClientArgs): Promise<BatchPayload> {
    return ctx.prisma.user.updateMany(args);
  }

  @TypeGraphQL.Mutation(_returns => Client, {
    nullable: false,
    description: undefined
  })
  async upsertClient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertClientArgs): Promise<Client> {
    return ctx.prisma.user.upsert(args);
  }

  @TypeGraphQL.Query(_returns => AggregateClient, {
    nullable: false,
    description: undefined
  })
  async aggregateClient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateClientArgs): Promise<AggregateClient> {
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

    return ctx.prisma.user.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
