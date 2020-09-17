import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateProblemArgs } from "./args/AggregateProblemArgs";
import { Problem } from "../../../models/Problem";
import { AggregateProblem } from "../../outputs/AggregateProblem";

@TypeGraphQL.Resolver(_of => Problem)
export class AggregateProblemResolver {
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
