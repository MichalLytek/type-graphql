import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateClientArgs } from "./args/AggregateClientArgs";
import { Client } from "../../../models/Client";
import { AggregateClient } from "../../outputs/AggregateClient";

@TypeGraphQL.Resolver(_of => Client)
export class AggregateClientResolver {
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
