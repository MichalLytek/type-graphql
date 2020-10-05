import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateCreatorArgs } from "./args/AggregateCreatorArgs";
import { CreateCreatorArgs } from "./args/CreateCreatorArgs";
import { DeleteCreatorArgs } from "./args/DeleteCreatorArgs";
import { DeleteManyCreatorArgs } from "./args/DeleteManyCreatorArgs";
import { FindFirstCreatorArgs } from "./args/FindFirstCreatorArgs";
import { FindManyCreatorArgs } from "./args/FindManyCreatorArgs";
import { FindOneCreatorArgs } from "./args/FindOneCreatorArgs";
import { UpdateCreatorArgs } from "./args/UpdateCreatorArgs";
import { UpdateManyCreatorArgs } from "./args/UpdateManyCreatorArgs";
import { UpsertCreatorArgs } from "./args/UpsertCreatorArgs";
import { Creator } from "../../../models/Creator";
import { AggregateCreator } from "../../outputs/AggregateCreator";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Creator)
export class CreatorCrudResolver {
  @TypeGraphQL.Query(_returns => Creator, {
    nullable: true,
    description: undefined
  })
  async creator(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOneCreatorArgs): Promise<Creator | null> {
    return ctx.prisma.creator.findOne(args);
  }

  @TypeGraphQL.Query(_returns => Creator, {
    nullable: true,
    description: undefined
  })
  async findFirstCreator(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindFirstCreatorArgs): Promise<Creator | null> {
    return ctx.prisma.creator.findFirst(args);
  }

  @TypeGraphQL.Query(_returns => [Creator], {
    nullable: false,
    description: undefined
  })
  async creators(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindManyCreatorArgs): Promise<Creator[]> {
    return ctx.prisma.creator.findMany(args);
  }

  @TypeGraphQL.Mutation(_returns => Creator, {
    nullable: false,
    description: undefined
  })
  async createCreator(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateCreatorArgs): Promise<Creator> {
    return ctx.prisma.creator.create(args);
  }

  @TypeGraphQL.Mutation(_returns => Creator, {
    nullable: true,
    description: undefined
  })
  async deleteCreator(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteCreatorArgs): Promise<Creator | null> {
    return ctx.prisma.creator.delete(args);
  }

  @TypeGraphQL.Mutation(_returns => Creator, {
    nullable: true,
    description: undefined
  })
  async updateCreator(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateCreatorArgs): Promise<Creator | null> {
    return ctx.prisma.creator.update(args);
  }

  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyCreator(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteManyCreatorArgs): Promise<BatchPayload> {
    return ctx.prisma.creator.deleteMany(args);
  }

  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyCreator(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateManyCreatorArgs): Promise<BatchPayload> {
    return ctx.prisma.creator.updateMany(args);
  }

  @TypeGraphQL.Mutation(_returns => Creator, {
    nullable: false,
    description: undefined
  })
  async upsertCreator(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertCreatorArgs): Promise<Creator> {
    return ctx.prisma.creator.upsert(args);
  }

  @TypeGraphQL.Query(_returns => AggregateCreator, {
    nullable: false,
    description: undefined
  })
  async aggregateCreator(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateCreatorArgs): Promise<AggregateCreator> {
    function transformFields(fields: Record<string, any>): Record<string, any> {
      return Object.fromEntries(
        Object.entries(fields)
          .filter(([key, value]) => !key.startsWith("_"))
          .map<[string, any]>(([key, value]) => {
            if (Object.keys(value).length === 0) {
              return [key, true];
            }
            return [key, transformFields(value)];
          }),
      );
    }

    return ctx.prisma.creator.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
