import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateCreatorArgs } from "./args/AggregateCreatorArgs";
import { Creator } from "../../../models/Creator";
import { AggregateCreator } from "../../outputs/AggregateCreator";

@TypeGraphQL.Resolver(_of => Creator)
export class AggregateCreatorResolver {
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
