import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateProblemArgs } from "./args/AggregateProblemArgs";
import { CreateProblemArgs } from "./args/CreateProblemArgs";
import { DeleteManyProblemArgs } from "./args/DeleteManyProblemArgs";
import { DeleteProblemArgs } from "./args/DeleteProblemArgs";
import { FindFirstProblemArgs } from "./args/FindFirstProblemArgs";
import { FindManyProblemArgs } from "./args/FindManyProblemArgs";
import { FindOneProblemArgs } from "./args/FindOneProblemArgs";
import { UpdateManyProblemArgs } from "./args/UpdateManyProblemArgs";
import { UpdateProblemArgs } from "./args/UpdateProblemArgs";
import { UpsertProblemArgs } from "./args/UpsertProblemArgs";
import { Problem } from "../../../models/Problem";
import { AggregateProblem } from "../../outputs/AggregateProblem";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Problem)
export class ProblemCrudResolver {
  @TypeGraphQL.Query(_returns => Problem, {
    nullable: true,
    description: undefined
  })
  async problem(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOneProblemArgs): Promise<Problem | null> {
    return ctx.prisma.problem.findOne(args);
  }

  @TypeGraphQL.Query(_returns => Problem, {
    nullable: true,
    description: undefined
  })
  async findFirstProblem(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindFirstProblemArgs): Promise<Problem | null> {
    return ctx.prisma.problem.findFirst(args);
  }

  @TypeGraphQL.Query(_returns => [Problem], {
    nullable: false,
    description: undefined
  })
  async problems(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindManyProblemArgs): Promise<Problem[]> {
    return ctx.prisma.problem.findMany(args);
  }

  @TypeGraphQL.Mutation(_returns => Problem, {
    nullable: false,
    description: undefined
  })
  async createProblem(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateProblemArgs): Promise<Problem> {
    return ctx.prisma.problem.create(args);
  }

  @TypeGraphQL.Mutation(_returns => Problem, {
    nullable: true,
    description: undefined
  })
  async deleteProblem(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteProblemArgs): Promise<Problem | null> {
    return ctx.prisma.problem.delete(args);
  }

  @TypeGraphQL.Mutation(_returns => Problem, {
    nullable: true,
    description: undefined
  })
  async updateProblem(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateProblemArgs): Promise<Problem | null> {
    return ctx.prisma.problem.update(args);
  }

  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyProblem(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteManyProblemArgs): Promise<BatchPayload> {
    return ctx.prisma.problem.deleteMany(args);
  }

  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyProblem(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateManyProblemArgs): Promise<BatchPayload> {
    return ctx.prisma.problem.updateMany(args);
  }

  @TypeGraphQL.Mutation(_returns => Problem, {
    nullable: false,
    description: undefined
  })
  async upsertProblem(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertProblemArgs): Promise<Problem> {
    return ctx.prisma.problem.upsert(args);
  }

  @TypeGraphQL.Query(_returns => AggregateProblem, {
    nullable: false,
    description: undefined
  })
  async aggregateProblem(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateProblemArgs): Promise<AggregateProblem> {
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

    return ctx.prisma.problem.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
