import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregatePostArgs } from "./args/AggregatePostArgs";
import { Post } from "../../../models/Post";
import { AggregatePost } from "../../outputs/AggregatePost";

@TypeGraphQL.Resolver(_of => Post)
export class AggregatePostResolver {
  @TypeGraphQL.Query(_returns => AggregatePost, {
    nullable: false,
    description: undefined
  })
  async aggregatePost(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregatePostArgs): Promise<AggregatePost> {
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

    return ctx.prisma.post.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
